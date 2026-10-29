# OnlyEvent Worker 部署助手 (Windows PowerShell 5.1+)
# 用法（在仓库任意位置）：
#   .\cloud\scripts\deploy.ps1 -Step Verify      # 只检查线上，不改任何东西
#   .\cloud\scripts\deploy.ps1 -Step Backup      # 只备份线上 D1
#   .\cloud\scripts\deploy.ps1 -Step Deploy      # 备份 + 检查 + 测试 + 部署 + 验证（部署前要求输入 yes）
#   .\cloud\scripts\deploy.ps1 -Step Rollback    # 回滚到部署前记录的版本（要求输入 yes）
# 完整输出写在 %TEMP%\oe-*.log，屏幕上只显示结果；失败时才显示最后几行。
param(
  [ValidateSet('Verify','Backup','Deploy','Rollback')][string]$Step = 'Verify',
  [string]$RollbackTo = '',
  [switch]$Force
)
$ErrorActionPreference = 'Stop'
$cloud   = Split-Path -Parent $PSScriptRoot
$repo    = Split-Path -Parent $cloud
$stamp   = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$backups = Join-Path $HOME 'Documents\OnlyEvent-backups'
$stateFile = Join-Path $backups 'last-deploy.json'
$domain  = 'onlyevent.cn'

function Ok($m)   { Write-Host "  [OK]   $m" -ForegroundColor Green }
function Bad($m)  { Write-Host "  [失败] $m" -ForegroundColor Red; $script:failed++ }
function Info($m) { Write-Host $m -ForegroundColor Cyan }
$script:failed = 0

# 运行一条命令，完整输出写日志；成功返回 $true。失败时只打印日志最后几行。
function Run($title, $command, $dir = $cloud) {
  $log = Join-Path $env:TEMP ("oe-" + ($title -replace '[^\w]+','-') + "-$stamp.log")
  Push-Location $dir
  try {
    cmd.exe /c "$command > `"$log`" 2>&1"
    $code = $LASTEXITCODE
  } finally { Pop-Location }
  if ($code -eq 0) { Ok "$title（日志：$log）"; return $true }
  Bad "$title 退出码 $code，日志：$log"
  Get-Content $log -Tail 15 | ForEach-Object { Write-Host "         $_" -ForegroundColor DarkGray }
  return $false
}

function Confirm-Yes($question) {
  if ($Force) { return $true }
  $a = Read-Host "$question  输入 yes 继续"
  return ($a -eq 'yes')
}

function Backup-D1 {
  Info '== 备份线上 D1 =='
  $dir = Join-Path $backups (Get-Date -Format 'yyyy-MM-dd')
  New-Item -ItemType Directory -Force $dir | Out-Null
  $file = Join-Path $dir "d1-$stamp.sql"
  if (-not (Run 'D1 导出' "npx wrangler d1 export convention-publisher-db --remote --output=`"$file`"")) { return $null }
  if (-not (Test-Path $file)) { Bad '备份文件没有生成'; return $null }
  $rows = (Select-String -Path $file -Pattern '^INSERT' | Measure-Object).Count
  Ok ("备份文件 {0}（{1} 行数据，{2} KB）" -f $file, $rows, [int]((Get-Item $file).Length / 1KB))
  return $file
}

function Get-LiveVersion {
  $json = cmd.exe /c "cd /d `"$cloud`" && npx wrangler deployments list --name convention-publisher --json 2>nul"
  try {
    $text = ($json -join "`n"); $i = $text.IndexOf('[')
    $list = $text.Substring($i) | ConvertFrom-Json
    return $list[$list.Count - 1].versions[0].version_id
  } catch { return '' }
}

function Verify-Live {
  Info "== 验证 https://$domain（只读请求，不登录）=="
  $health = curl.exe -s -m 20 "https://$domain/health"
  if ($health -match '"version":"([^"]+)"') { Ok "Worker 版本 $($Matches[1])（这是后端版本号，不是编辑器版本）" } else { Bad "/health 没有返回版本：$health" }

  $admin = curl.exe -s -m 20 "https://$domain/admin/"
  if ($admin -match 'authQuickName') { Ok '/admin/ 是新的 v8 后台（含注册表单）' } else { Bad '/admin/ 看起来还是旧后台' }

  $pub = curl.exe -s -m 20 "https://$domain/v8/publisher.js"
  if ($pub -match 'cn\|localhost') { Ok '编辑器在 onlyevent.cn 下使用同源接口' } else { Bad '编辑器客户端不是最新版本' }

  $hdr = (curl.exe -s -m 20 -I "https://$domain/admin/") -join "`n"
  foreach ($h in 'x-frame-options: SAMEORIGIN','x-content-type-options: nosniff') {
    if ($hdr -match [regex]::Escape($h)) { Ok "响应头 $h" } else { Bad "缺少响应头 $h" }
  }

  $robots = (curl.exe -s -m 20 "https://$domain/robots.txt") -join ' '
  if ($robots -match 'Disallow: /admin/' -and $robots -match 'Disallow: /api/') { Ok 'robots.txt 已禁止后台和接口被收录' } else { Bad "robots.txt 不对：$robots" }

  $code = curl.exe -s -m 20 -o NUL -w '%{http_code}' "https://never-published-xyz.$domain/"
  if ($code -eq '404') { Ok '未发布的游客站网址返回 404' } else { Bad "未发布的游客站返回 $code（应为 404）" }

  $vr = (curl.exe -s -m 20 "https://never-published-xyz.$domain/robots.txt") -join ' '
  if ($vr -match 'Allow: /') { Ok '游客站 robots.txt 允许收录' } else { Bad "游客站 robots.txt 不对：$vr" }
}

switch ($Step) {
  'Verify' { Verify-Live }

  'Backup' { [void](Backup-D1) }

  'Deploy' {
    Info '== 部署前检查 =='
    $dirty = git -C $repo status --porcelain
    if ($dirty -and -not $Force) { Bad '仓库里有没提交的改动。先提交，或加 -Force（cloud/web 是从仓库生成的，建议提交后再部署）。'; break }
    if ($dirty) { Write-Host '  [提示] 仓库有未提交改动，-Force 继续' -ForegroundColor Yellow }
    Ok ('部署内容来自提交 ' + (git -C $repo rev-parse --short HEAD))
    $prev = Get-LiveVersion
    if ($prev) { Ok "当前线上版本（回滚用）：$prev" } else { Write-Host '  [提示] 没能读取当前线上版本，回滚时需要手动指定' -ForegroundColor Yellow }
    if (-not (Confirm-Yes '会把当前代码部署到线上 onlyevent.cn。')) { Write-Host '已取消。'; break }

    $bk = Backup-D1
    if (-not $bk) { Bad '备份失败，已停止部署'; break }
    New-Item -ItemType Directory -Force $backups | Out-Null
    @{ previousVersion = $prev; backup = $bk; time = (Get-Date).ToString('s') } | ConvertTo-Json | Set-Content $stateFile -Encoding UTF8

    Info '== 检查、测试、部署 =='
    if (-not (Run 'npm run deploy（检查 + 测试 + wrangler deploy）' 'npm run deploy')) { Write-Host '部署失败：线上没有变化（失败发生在检查/测试，或上传阶段，请看上面日志）。' -ForegroundColor Red; break }
    $now = Get-LiveVersion
    if ($now) { Ok "新的线上版本：$now" }
    Verify-Live
    if ($script:failed) { Write-Host "`n有 $script:failed 项验证没通过。需要回滚请运行：.\cloud\scripts\deploy.ps1 -Step Rollback" -ForegroundColor Yellow }
  }

  'Rollback' {
    $target = $RollbackTo
    if (-not $target -and (Test-Path $stateFile)) { $target = (Get-Content $stateFile -Raw | ConvertFrom-Json).previousVersion }
    if (-not $target) { Bad '没有可回滚的版本。用 -RollbackTo <版本ID> 指定。'; break }
    Info "== 回滚到 $target =="
    if (-not (Confirm-Yes "线上会回到版本 $target（D1 数据不受影响）。")) { Write-Host '已取消。'; break }
    if (Run 'wrangler rollback' "npx wrangler rollback $target --message `"manual rollback $stamp`" -y") { Verify-Live }
  }
}

if ($script:failed) { Write-Host "`n结果：$script:failed 项失败" -ForegroundColor Red; exit 1 }
Write-Host "`n结果：全部通过" -ForegroundColor Green

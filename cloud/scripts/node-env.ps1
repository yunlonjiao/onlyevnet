# 让 wrangler 用真正的 Node 跑。
# 为什么需要：有些环境（如 DSH Desktop）把 PATH 里的 node 换成了 Electron 垫片（node.cmd），
# wrangler 4.15x 在垫片下会把参数解析错位，报
#   X ERROR Unknown arguments: remote, output, ...\wrangler-dist\cli.js, d1, export ...
# 于是备份、读线上版本、部署全部失败。这里检测到垫片就改用独立安装的 Node。
# 手动指定：$env:OE_NODE_DIR = 'D:\nodejs'
function Use-RealNode {
  $candidates = @()
  if ($env:OE_NODE_DIR) { $candidates += $env:OE_NODE_DIR }
  if ($env:ProgramFiles) { $candidates += (Join-Path $env:ProgramFiles 'nodejs') }
  $pf86 = [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')
  if ($pf86) { $candidates += (Join-Path $pf86 'nodejs') }

  $cmd = Get-Command node -ErrorAction SilentlyContinue | Select-Object -First 1
  $current = if ($cmd) { $cmd.Source } else { '' }
  $isShim = $true
  if ($current -and ($current -match '(?i)\\node\.exe$') -and ($current -notmatch '(?i)dsh-desktop|\.desktop-bin')) {
    $isShim = $false
  }
  if (-not $isShim) { return }

  foreach ($dir in $candidates) {
    $exe = Join-Path $dir 'node.exe'
    if ((Test-Path $exe) -and ($exe -notmatch '(?i)dsh-desktop|\.desktop-bin')) {
      $env:PATH = "$dir;$env:PATH"
      Write-Host "  [提示] PATH 里的 node 是垫片（$current），已改用 $exe" -ForegroundColor DarkGray
      return
    }
  }
  Write-Host "  [警告] PATH 里的 node 是垫片（$current），且没找到独立安装的 Node；wrangler 可能报 Unknown arguments。请设 `$env:OE_NODE_DIR 指向 Node 安装目录。" -ForegroundColor Yellow
}

Use-RealNode

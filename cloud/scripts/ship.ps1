# OnlyEvent 一键发布：设代理 -> 推送 -> 检查线上 -> 备份 -> 部署（部署前要求输入 yes）
# 用法（在任意位置，PowerShell）：
#   .\cloud\scripts\ship.ps1              # 推送 + Verify + Deploy（Deploy 内含备份、测试、部署、验证）
#   .\cloud\scripts\ship.ps1 -NoPush      # 不推送，只检查 + 部署
#   .\cloud\scripts\ship.ps1 -PushOnly    # 只推送
#   .\cloud\scripts\ship.ps1 -Rollback    # 回滚到部署前记录的版本
#   .\cloud\scripts\ship.ps1 -Force       # 跳过部署前的 yes 确认（脚本/自动化用）
param(
  [switch]$NoPush,
  [switch]$PushOnly,
  [switch]$Rollback,
  [switch]$Force,
  [string]$Proxy = 'http://127.0.0.1:12334',
  [string]$RemoteBranch = 'preview/guide-sakura-access'
)
$ErrorActionPreference = 'Stop'
$repo   = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$deploy = Join-Path $PSScriptRoot 'deploy.ps1'
$env:HTTPS_PROXY = $Proxy
$env:HTTP_PROXY  = $Proxy
Set-Location $repo

if ($Rollback) { & $deploy -Step Rollback -Force:$Force; exit $LASTEXITCODE }

if (-not $NoPush) {
  Write-Host "== 推送到 origin/$RemoteBranch ==" -ForegroundColor Cyan
  git status -sb
  git push origin "HEAD:$RemoteBranch"
  if ($LASTEXITCODE -ne 0) { Write-Host '推送失败，已停止。' -ForegroundColor Red; exit 1 }
}
if ($PushOnly) { exit 0 }

& $deploy -Step Verify
& $deploy -Step Deploy -Force:$Force

# 本地预览：把仓库根目录跑成一个静态站点，改完刷新就能看，不用部署到 Cloudflare。
# 用法（任意位置）：
#   .\cloud\scripts\preview.ps1                 # 默认 4321 端口
#   .\cloud\scripts\preview.ps1 -Port 4400      # 换端口
# 按 Ctrl+C 结束。注意：发布/登录等接口在这里不可用，那类操作仍然走 onlyevent.cn。
param(
  [int]$Port = 4321
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo

# 优先用独立安装的 Node（绕过 Electron 垫片，和 deploy.ps1 的处理一致）。
. (Join-Path $PSScriptRoot 'node-env.ps1')

Write-Host "== OnlyEvent 本地预览 ==" -ForegroundColor Cyan
Write-Host "编辑器:      http://127.0.0.1:$Port/v8/?template=03-creator-market" -ForegroundColor Green
Write-Host "其他模板:    http://127.0.0.1:$Port/v8/?template=01-ip-only （02-scrapbook 到 08-birthday）"
Write-Host "主办方后台:  http://127.0.0.1:$Port/admin/"
Write-Host "改完文件直接刷新页面即可（服务端 no-store，不吃缓存）。Ctrl+C 结束。`n"

node (Join-Path $PSScriptRoot 'preview-server.mjs') $Port

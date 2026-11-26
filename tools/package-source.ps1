param(
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$repo = Split-Path -Parent $PSScriptRoot
$exclude = @('node_modules', '.git', 'cloud\web', 'quality\test-results', '.wrangler', '.vercel', 'dist', 'coverage', 'playwright-report')
$files = Get-ChildItem -LiteralPath $repo -Recurse -File | Where-Object {
  $relative = $_.FullName.Substring($repo.Length + 1)
  $relative -notmatch '(^|\\)(node_modules|\.git|test-results|\.wrangler|\.vercel|dist|coverage|playwright-report)(\\|$)' -and
    -not ($relative -eq 'cloud\web' -or $relative.StartsWith('cloud\web\'))
}
if (Test-Path $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }
$archive = [System.IO.Compression.ZipFile]::Open($OutputPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $name = $file.FullName.Substring($repo.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $name, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $archive.Dispose()
}
Write-Output "packaged $($files.Count) files -> $OutputPath"

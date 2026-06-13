# PowerShell script to copy Valkira images into frontend/public/img
# Run from PowerShell:
#   .\copy-valkira-images.ps1

$source = "c:\Users\angie\OneDrive\Documents\tareas\Programacion\Valikiraprueba\Valikira\img"
$dest = "c:\Users\angie\OneDrive\Documents\tareas\Programacion\Proyecto Comercio\Proyecto Comercio\frontend\public\img"

if (-Not (Test-Path $source)) {
  Write-Error "Source folder not found: $source"
  exit 1
}

if (-Not (Test-Path $dest)) {
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

Get-ChildItem -Path $source -File | ForEach-Object {
  $dst = Join-Path $dest $_.Name
  Copy-Item -Path $_.FullName -Destination $dst -Force
  Write-Output "Copied: $($_.Name)"
}

Write-Output "Done. Images copied to $dest"

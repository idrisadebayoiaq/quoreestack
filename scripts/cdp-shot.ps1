# Dev helper: decode a saved CDP Page.captureScreenshot JSON response to an image file.
# Without -In, decodes the most recent capture in the Cursor browser-logs folder.
param([string]$In, [Parameter(Mandatory)] [string]$Out)
if (-not $In) {
  $In = (Get-ChildItem "$env:USERPROFILE\.cursor\browser-logs\cdp-response-Page.captureScreenshot-*.json" |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
}
$json = Get-Content -Raw $In | ConvertFrom-Json
$data = if ($json.data) { $json.data } else { $json.result.data }
[IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($data))
Write-Output $Out

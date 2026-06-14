param(
  [switch]$Install,
  [switch]$SkipWeb,
  [switch]$SkipFirebase
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$nodeRuntime = "C:\Users\$env:USERNAME\AppData\Local\OpenAI\Codex\runtimes\cua_node\2f053e67fec2d258\bin"
$portableJava = Get-ChildItem "C:\Users\$env:USERNAME\.local\java" -Filter java.exe -Recurse -ErrorAction SilentlyContinue |
  Select-Object -First 1

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue) -and (Test-Path "$nodeRuntime\npm.cmd")) {
  $env:Path = "$nodeRuntime;$env:Path"
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  throw "Node.js and npm are required. Install Node.js 20 or add npm to PATH."
}

if (-not (Get-Command java.exe -ErrorAction SilentlyContinue) -and $portableJava) {
  $env:Path = "$($portableJava.DirectoryName);$env:Path"
}

if ($Install) {
  npm.cmd --prefix "$repoRoot\campnion-site" install
  npm.cmd --prefix "$repoRoot\database\firebase\functions" install
}

if (-not $SkipWeb) {
  Start-Process npm.cmd `
    -ArgumentList "--prefix", "$repoRoot\campnion-site", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000" `
    -WorkingDirectory "$repoRoot\campnion-site" `
    -WindowStyle Hidden
}

if (-not $SkipFirebase) {
  if (-not (Get-Command java.exe -ErrorAction SilentlyContinue)) {
    Write-Warning "Java is not installed; Firebase database/storage emulators cannot start."
  } else {
    Start-Process npx.cmd `
      -ArgumentList "firebase-tools", "emulators:start", "--project", "demo-puzzly" `
      -WorkingDirectory "$repoRoot\database\firebase" `
      -WindowStyle Hidden
  }
}

Write-Host "Web: http://0.0.0.0:3000"
Write-Host "Firebase ports are defined in database/firebase/firebase.json and bind to 0.0.0.0."

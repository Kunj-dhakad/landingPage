param(
  [Parameter(Mandatory = $true)][string]$DatabaseDirectory,
  [int]$SpawnedProcessId
)
$ErrorActionPreference = 'Stop'
$taskWorkspace = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskRuntimeRoot = [System.IO.Path]::GetFullPath((Join-Path $taskWorkspace '.runtime'))
$taskTarget = [System.IO.Path]::GetFullPath($DatabaseDirectory)
if (-not $taskTarget.StartsWith($taskRuntimeRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase) -or (Split-Path -Leaf $taskTarget) -notmatch '^test-postgres-\d+$') {
  throw 'Refusing to stop processes outside an isolated test cluster.'
}
$taskProcesses = @(Get-CimInstance Win32_Process -Filter "name='postgres.exe'")
$taskOwnedIds = @($SpawnedProcessId)
for ($taskPass = 0; $taskPass -lt 5; $taskPass++) {
  foreach ($taskProcess in $taskProcesses) {
    $taskMatchesDirectory = $taskProcess.CommandLine -and $taskProcess.CommandLine.IndexOf($taskTarget, [System.StringComparison]::OrdinalIgnoreCase) -ge 0
    if ($taskMatchesDirectory -or $taskOwnedIds -contains $taskProcess.ParentProcessId) {
      if ($taskOwnedIds -notcontains $taskProcess.ProcessId) { $taskOwnedIds += $taskProcess.ProcessId }
    }
  }
}
foreach ($taskProcess in $taskProcesses) {
  if ($taskOwnedIds -contains $taskProcess.ProcessId) {
    Stop-Process -Id $taskProcess.ProcessId -ErrorAction SilentlyContinue
  }
}

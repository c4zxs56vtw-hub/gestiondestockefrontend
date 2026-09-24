# verify-backend-readonly.ps1
# Verifies the backend is reachable (read-only smoke test, no mutations)
$base = $env:VITE_API_BASE_URL ?? "http://localhost:8080/api/v1"
Write-Host "Testing backend at $base..."
try {
  $response = Invoke-RestMethod -Uri "$base/categories?page=0&size=1" -Method GET -TimeoutSec 5
  Write-Host "OK: Backend reachable. Categories response received."
} catch {
  Write-Warning "Backend not reachable at $base. Is Spring Boot running?"
  exit 1
}

$ErrorActionPreference = "Stop"
$signupBody = @{
    email = "test100@example.com"
    password = "password123"
    full_name = "Test User"
} | ConvertTo-Json

$signup = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/auth/signup' -Method Post -Body $signupBody -ContentType 'application/json'

$loginBody = @{
    username = "test100@example.com"
    password = "password123"
}
$login = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/auth/login' -Method Post -Body $loginBody -ContentType 'application/x-www-form-urlencoded'

$token = $login.access_token

$user = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/users/me' -Method Get -Headers @{Authorization="Bearer $token"}
$user | ConvertTo-Json

$interviews = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/interviews/' -Method Get -Headers @{Authorization="Bearer $token"}
$interviews | ConvertTo-Json

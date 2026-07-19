$ErrorActionPreference = "Stop"
$rand = Get-Random
$email = "test_$rand@example.com"
$signupBody = @{
    email = $email
    password = "password123"
    full_name = "Gemini Tester"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/auth/signup' -Method Post -Body $signupBody -ContentType 'application/json' | Out-Null

$loginBody = @{
    username = $email
    password = "password123"
}
$login = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/auth/login' -Method Post -Body $loginBody -ContentType 'application/x-www-form-urlencoded'
$token = $login.access_token

Write-Host "Token obtained, calling generate..."

$generateBody = @{
    role = "Software Engineer"
    difficulty = "Easy"
    interview_type = "Technical"
} | ConvertTo-Json

$interview = Invoke-RestMethod -Uri 'http://localhost:8000/api/v1/interviews/generate' -Method Post -Headers @{Authorization="Bearer $token"} -Body $generateBody -ContentType 'application/json'

Write-Host "Generated Questions:"
$interview.questions | ForEach-Object { $_.question_text }

Write-Host "`nCalling evaluate..."
$answers = @{}
foreach ($q in $interview.questions) {
    $answers[$q.id.ToString()] = "I would use Python because it is very easy and has good libraries."
}

$evaluateBody = $answers | ConvertTo-Json
$evaluated = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/interviews/$($interview.id)/evaluate" -Method Post -Headers @{Authorization="Bearer $token"} -Body $evaluateBody -ContentType 'application/json'

Write-Host "`nEvaluated Feedback:"
$evaluated.questions | ForEach-Object { 
    Write-Host "Q: $($_.question_text)"
    Write-Host "Score: $($_.score)"
    Write-Host "Feedback: $($_.ai_feedback)`n"
}

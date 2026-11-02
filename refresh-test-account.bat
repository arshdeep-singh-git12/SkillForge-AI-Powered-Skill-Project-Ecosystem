@echo off
echo ==============================================================
echo  SkillForge - Resetting Test Account (test@example.com)
echo ==============================================================
echo.

echo Sending reset request to backend API...
curl -X POST http://localhost:5000/api/auth/reset-test-account -H "Content-Type: application/json"

echo.
echo.
echo Done! The test account has been completely wiped and recreated.
echo You can now log in fresh at http://localhost:3000 using test@example.com / password123
echo.
pause

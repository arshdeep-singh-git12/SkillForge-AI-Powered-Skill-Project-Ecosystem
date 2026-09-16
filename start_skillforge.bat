@echo off
cd /d "%~dp0"
title SkillForge Startup Script
color 0B

echo =======================================================
echo.
echo    _____ _    _ _ _ ______                       
echo   / ____^| ^|  (_) ^| ^|  ____^|                      
echo  ^| (___ ^| ^| ___^| ^| ^| ^|__ ___  _ __ __ _  ___     
echo   \___ \^| ^|/ / ^| ^| ^|  __/ _ \^| '__/ _` ^|/ _ \    
echo   ____) ^|   <^| ^| ^| ^| ^| ^| (_) ^| ^| ^| (_^| ^|  __/    
echo  ^|_____/^|_^|\_\_^_^_^_^_^|  \___/^|_^|  \__, ^|\___^|    
echo                                   __/ ^|          
echo                                  ^|___/           
echo.
echo =======================================================
echo.
echo Booting up the SkillForge Engineered Ecosystem...
echo.

echo [1/2] Starting Backend Server (MongoDB ^& Express)...
start cmd /k "title SkillForge Backend && cd backend && node src\server.js"
echo  -^> Backend terminal launched on port 5000.

timeout /t 3 >nul

echo [2/2] Starting Frontend App (Next.js)...
start cmd /k "title SkillForge Frontend && cd frontend && node ..\node_modules\next\dist\bin\next dev"
echo  -^> Frontend terminal launched on port 3000.

echo.
echo =======================================================
echo.
echo Startup sequences initiated! 
echo Keep the two new terminal windows open.
echo.
echo - Frontend URL: http://localhost:3000
echo - Backend URL:  http://localhost:5000/api/health
echo.
echo Press any key to close this launcher...
pause >nul

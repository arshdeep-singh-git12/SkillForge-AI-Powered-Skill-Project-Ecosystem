@echo off
cd /d "%~dp0"
title SkillForge Database Reset Utility
color 0C

echo =======================================================
echo          WARNING: DATABASE RESET INITIATED
echo =======================================================
echo.
echo This script will delete ALL user accounts, projects,
echo teams, skills, and certifications from your local database.
echo.
echo IMPORTANT: Please ensure that your SkillForge Backend and 
echo Frontend terminal windows are CLOSED before continuing.
echo.
pause

echo.
echo Deleting database files...
if exist "backend\.local_db" (
    rmdir /S /Q "backend\.local_db"
    echo [SUCCESS] Database folder deleted.
) else (
    echo [INFO] Database folder not found. It may already be empty.
)

echo.
echo Reset complete! You now have a completely fresh database.
echo.
set /p START_APP="Do you want to start SkillForge now? (Y/N): "
if /I "%START_APP%"=="Y" (
    start start_skillforge.bat
)

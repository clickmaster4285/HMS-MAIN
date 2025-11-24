@echo off
title HMS App - Development Mode
echo ======================================
echo Starting HMS App (Backend + Frontend)
echo ======================================

:: Go to project root
cd /d "C:\Users\PC\Desktop\hms-11n0v"

:: Run development command (both backend & frontend)
echo.
echo Running: npm run dev
echo --------------------------------------
call npm run dev

:: Keep window open
echo.
echo --------------------------------------
echo HMS App is running (Press Ctrl + C to stop)
pause

@echo off
title HMS App - Production Mode (Separate)
echo ======================================
echo Starting HMS Backend + Frontend Separately
echo ======================================

:: Go to project root
cd /d "C:\Users\PC\Desktop\hms-11n0v"

:: Start backend in production mode
start cmd /k "cd /d "C:\Users\PC\Desktop\hms-11n0v\backend" && set NODE_ENV=production && node server.js"

:: Build and serve frontend
call npm run build --workspace=frontend
start cmd /k "cd /d "C:\Users\PC\Desktop\hms-11n0v\frontend" && npm run preview"

:: Wait and show URLs
timeout /t 5
echo.
echo ======================================
echo HMS App Running:
echo Backend:  http://192.168.10.253:5002
echo Frontend: http://192.168.10.253:4173 (or 5173)
echo ======================================
pause
@echo off
title HMS App - Production Mode

echo ======================================
echo Starting HMS App (SPA - Production)
echo Frontend (Build) + Backend
echo ======================================

cd /d "C:\Users\PC\Desktop\hms-11n0v" || (
  echo ❌ Project path not found!
  pause
  exit /b
)

echo.
echo --------------------------------------
echo Building frontend (Vite)
echo --------------------------------------
call npm run build --workspace=frontend

echo.
echo --------------------------------------
echo Starting backend (serving SPA)
echo --------------------------------------
call npm run start --workspace=backend

pause
@echo off
title Abid Nalakath - Portfolio & Local Admin Panel
cd /d "%~dp0"

echo ===================================================================
echo     ABID NALAKATH - CREATIVE DESIGNER PORTFOLIO & LOCAL ADMIN
echo ===================================================================
echo.
echo [1/3] Starting Local Express Backend (Port 3001)...
start "Abid Portfolio Backend Server" /min cmd /c "node server/index.js"

echo [2/3] Waiting 2 seconds for SQLite database initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Opening Browser:
echo       - Public Portfolio: http://localhost:5173/
echo       - Admin Login:      http://localhost:5173/admin/login
echo       - Visual Editor:    http://localhost:5173/admin/editor
echo       - Default Account:  admin / admin123
echo.
start "" "http://localhost:5173"

echo Starting Vite Frontend Dev Server...
npm run dev -- --port 5173 --host
pause

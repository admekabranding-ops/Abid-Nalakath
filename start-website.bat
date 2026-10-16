@echo off
cd /d "%~dp0"
echo Starting Abid Nalakath Portfolio...
start "" "http://localhost:5173"
npm run dev -- --port 5173 --host
pause

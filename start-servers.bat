@echo off
echo ==============================================
echo   STARTING AI-NOC DASHBOARD & BACKEND
echo ==============================================

:: Start Python Backend in a new window
echo Starting FastAPI Backend (Traffic Analyzer)...
start cmd /k "title AI-NOC Backend && python backend/packet_monitor.py"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: Start React Frontend
echo Starting React Frontend...
start cmd /k "title AI-NOC Frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Please wait a moment, then open http://localhost:3000 in your browser.
echo.
pause

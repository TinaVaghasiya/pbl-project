@echo off
echo ========================================
echo Starting Smart Sign Language Interpreter
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Python AI Service...
start "Python AI Service" cmd /k "cd python-ai && python app.py"
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Python AI: http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Backend Server*" /T /F
taskkill /FI "WindowTitle eq Python AI Service*" /T /F
taskkill /FI "WindowTitle eq Frontend*" /T /F

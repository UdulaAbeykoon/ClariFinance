@echo off
echo Starting ClariFi System...
echo --------------------------------
echo Starting Backend on Port 8000...
start "ClariFi Backend" cmd /k "python api_server.py"
timeout /t 5
echo.
echo Starting Frontend on Port 3000...
cd frontend
start "ClariFi Frontend" cmd /k "npm run dev"
echo.
echo System Started!
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:3000
pause

@echo off
echo Starting StreamPulse...

echo Starting Backend Server (Port 43123)...
cd server
start "StreamPulse Backend" npm run dev
cd ..

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Client (Port 3001)...
cd client
start "StreamPulse Frontend" npm run dev -- --open
cd ..

echo StreamPulse is running!
echo Backend: http://localhost:43123
echo Frontend: http://localhost:3001
pause

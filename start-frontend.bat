@echo off
echo Starting StreamPulse Frontend (dev)...
cd /d "%~dp0client"
npm run dev -- --open

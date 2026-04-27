@echo off
echo Starting Budgeter...
start "Budgeter Backend" cmd /k "cd Budgetier\backend && npm run dev"
start "Budgeter Frontend" cmd /k "cd Budgetier\frontend && npm start"
echo Done.
pause

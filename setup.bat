@echo off
echo Starting 8 Puzzle Backend and Frontend...
echo.
echo Installing dependencies...
call npm install
cd backend
call npm install
cd ..
echo.
echo Dependencies installed!
echo.
echo To run the application:
echo   Terminal 1: cd backend && npm run dev
echo   Terminal 2: npm run dev
pause

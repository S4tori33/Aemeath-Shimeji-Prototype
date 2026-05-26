@echo off
echo Starting Aeamaeth Shimeji...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed!
    echo Please install from https://nodejs.org
    pause
    exit /b 1
)
npm install
npx electron .

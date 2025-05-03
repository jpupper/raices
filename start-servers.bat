@echo off
echo Starting both servers...

start cmd /k "cd bmraices_local && node server.js"
start cmd /k "cd brinterface && node server.js"

echo Both servers are running!
echo bmraices_local server: http://localhost:3000
echo brinterface server: http://localhost:3400
echo.
echo Press any key to stop both servers...
pause > nul

taskkill /f /im node.exe
echo All servers stopped.

@echo off
echo Starting both servers...

start cmd /k "cd raicesgen && node server.js"
start cmd /k "cd raicesinterface && node server.js"

echo Both servers are running!
echo Raices gen server: http://localhost:3000
echo Raices interface server: http://localhost:3400
echo.
echo Press any key to stop both servers...
pause > nul

taskkill /f /im node.exe
echo All servers stopped.

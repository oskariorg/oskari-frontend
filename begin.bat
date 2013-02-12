@ECHO OFF
ECHO Setting browser locations. Skip if installed at default locations.
ECHO.

set binpath=%CD%
set binpath=%binpath%/tools/node_modules/.bin

:ffcheck
echo Please input path to firefox
echo Current FIREFOX_BIN: %FIREFOX_BIN%
echo (e.g. C:\Omat\Program Files\Mozilla Firefox\firefox.exe) or press ENTER to skip
set /p ff=FIREFOX_BIN:
if not defined ff (goto chromecheck)
if exist "%ff%" (goto ffset)
echo firefox.exe doesn't exist in %ff%
goto ffcheck

:ffset
set FIREFOX_BIN=%ff%
REM clear ff variable
set ff=
goto chromecheck

:chromecheck
echo Please input path to chrome
echo Current CHROME_BIN: %CHROME_BIN%
echo (e.g. C:\Program Files\Google\Chrome\Application\chrome.exe) or press ENTER to skip
set /p chrome=CHROME_BIN:
if not defined chrome (goto binexistcheck)
if exist "%chrome%" (goto chromeset)
echo chrome.exe doesn't exist in %chrome%
goto chromecheck

:chromeset
set CHROME_BIN=%chrome%
REM clear chrome variable
set chrome=
goto binexistcheck

:installpackages
echo %binpath%
echo run init.bat first. start.bat will be executed from init.bat
goto end

:binexistcheck
if exist %binpath% (goto binexists) else (goto installpackages)
goto end

:binexists
echo Setting grunt to path
set path=%path%;%binpath%
echo Starting testacular server and grunt watch
cd tools
start grunt.cmd testacularServer:dev
grunt.cmd watch
REM Note that the script will terminate and grunt.cmd will continue execution.
REM To return the execution to the script. Add "CALL" before crunt.cmd

:end
ECHO.
ECHO Press any key to exit.
REM Notice the space in the echo above. It looks better and will become important for other uses later on
pause>null
@ECHO ON
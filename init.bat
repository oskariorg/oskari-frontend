@ECHO OFF
cls

set binpath=%CD%
set binpath=%binpath%/tools/node_modules/.bin

:installpackages
echo Installing tools
cd tools

echo Please input http proxy url
echo (e.g. http://proxy.example.com:8080) or press ENTER to skip
set /p TEMPHTTPPROXY=PROXY URL:
if not defined TEMPHTTPPROXY (goto npminstall)
call npm config set proxy %TEMPHTTPPROXY%

echo Please input https proxy url
echo (e.g. https://proxy.example.com:8080) or press ENTER to skip
set /p TEMPHTTPSPROXY=PROXY URL:
if not defined TEMPHTTPSPROXY (goto npminstall)
call npm config set https-proxy %TEMPHTTPSPROXY%

REM clear TEMPHTTP(S)PROXY variables
set TEMPHTTPPROXY=
set TEMPHTTPSPROXY=

:npminstall
call npm install
cd ..
goto binexistcheck

:binexistcheck
if exist %binpath% (goto binexists) else (goto installpackages)
goto end

:binexists
echo init is done.
echo running start
begin.bat
@ECHO ON
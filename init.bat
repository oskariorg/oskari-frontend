@ECHO OFF
cls

set binpath=%CD%
set binpath=%binpath%/tools/node_modules/.bin

:installpackages
echo Installing tools
cd tools
call npm config set proxy http://wwwp-jkl.nls.fi:800
call npm config set https-proxy http://wwwp-jkl.nls.fi:800
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
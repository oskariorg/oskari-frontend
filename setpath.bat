@ECHO OFF

ECHO Setting node_modules .bin to path
set binpath=%CD%
set binpath=%binpath%/tools/node_modules/.bin
set path=%path%;%binpath%

:end
@ECHO ON
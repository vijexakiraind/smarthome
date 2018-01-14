@echo off
echo Building... "%1" "%2" "%3"
set result1=false
if "%1"=="/c" set result1=true
if "%1"=="/f" set result1=true
if "%1"=="" set result1=true
if %result1%==true (
    echo Type COM port number in the first argument ^( COM3 for example ^)
    EXIT /b
)
xcopy /s /y /q "%~dp0Core" "%~dp0build_temp\"
set resultc=false
if "%2"=="/c" set resultc=true
if "%3"=="/c" set resultc=true
if %resultc%==true (
    for /r "%~dp0\build_temp" %%i in (*.lua) do (
        node luatolc.js "%%i"
    )
)
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 reset
ping 127.0.0.1 -n 2 > nul
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 remove init.lua
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 reset
ping 127.0.0.1 -n 2 > nul
echo Formatting... 
set resultf=false
if "%2"=="/f" set resultf=true
if "%3"=="/f" set resultf=true
if %resultf%==true (
    node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 mkfs --noninteractive
) else (
    node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 mkfs 
)
echo Uploading...
for /r "%~dp0\build_temp" %%i in (*.lua *.png *.html *.json) do (
    echo %%i
    if NOT %%~xi==.lua-TEMPLATE (
        if %resultc%==true (
            if %%~ni==init (
                node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 upload "%%i"
            ) else (
                node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 upload --compile "%%i"
            )
        ) else (
            node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 upload "%%i"
        )
    )
)
rmdir /s /q "build_temp"
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 fsinfo
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 reset
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 terminal
echo ESP8266 ready!
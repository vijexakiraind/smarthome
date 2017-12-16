@echo off
echo Formatting... 
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 mkfs 
echo Building..
node "%~dp0build\builder.js" "%~dp0src\index.html" "%~dp0Core\page.html"
echo Uploading...
for /r "%~dp0\Core" %%i in (*.lua *.png *.html *.json) do (
    echo %%i
    node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200  upload "%%i"
)
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 fsinfo
node "%~dp0node_modules\nodemcu-tool\bin\nodemcu-tool.js" -p %1 -b 115200 reset
echo ESP8266 ready!
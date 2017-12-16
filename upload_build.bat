@echo off
echo Formatting...
node node_modules/nodemcu-tool/bin/nodemcu-tool.js -p %1 -b 115200 mkfs 
echo Building...
node build/builder.js index.html Core/page.html
echo Uploading...
for /r Core %%i in (*.lua *.png *.html *.json) do (
    echo %%i
    node node_modules/nodemcu-tool/bin/nodemcu-tool.js -p %1 -b 115200  upload "%%i"
)
node node_modules/nodemcu-tool/bin/nodemcu-tool.js -p %1 -b 115200 fsinfo
node node_modules/nodemcu-tool/bin/nodemcu-tool.js -p %1 -b 115200 reset
echo "Building..."
node build/builder.js src/index.html Core/page.html
echo "Uploading..."
node node_modules/nodemcu-tool/bin/nodemcu-tool.js -p %1 -b 115200 upload Core/page.html
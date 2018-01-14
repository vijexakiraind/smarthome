@echo off
call nodemcu-tool -p %1 -b 115200 reset
ping 127.0.0.1 -n 2 > nul
call nodemcu-tool -p %1 -b 115200 remove init.lua
call nodemcu-tool -p %1 -b 115200 reset
ping 127.0.0.1 -n 2 > nul
call nodemcu-tool -p %1 -b 115200 upload %2
call nodemcu-tool -p %1 -b 115200 upload init.lua
call nodemcu-tool -p %1 -b 115200 reset 
call nodemcu-tool -p %1 -b 115200 terminal
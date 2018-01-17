function api_core(data, request, sock, status_response, response, response_data) 
    -- get global variables
    print(request)
    if (pcall(function() encoder = sjson.encoder(api_tables[string.match(request, "/q/(.+)")]) end)) then
        repeat
            local chunk = encoder:read()
            print(chunk)
            response_data.string = chunk
            print(10, response_data.string)
        until chunk ~= nil
        table.insert(response, "}")
    elseif (request == "/q/searchfordevices") then

    elseif (request == "/q/changedevices") then
        clients_data = sjson.decode(data)
        file.open("clients_datafile.json", "w+")
        file.write(data)
        file.close()
    elseif (request == "/q/connectdevice") then
        data = sjson.decode(data)
        delayed_response = true
        http.get("http://"..data["ip"].."/connect", nil, function(status_code, body)
            local pcall_stat, err = pcall(function()
                delayed_response = false
                print(status_code)
                if (not pcall(function() body = sjson.decode(body) end)) or (body["client"]~="esp8266") then error("Got wrong answer from device. Check your firmware.") end
                print("not error")
                body["client"] = nil
                if(status_code ~= -1) then
                    table.insert(devices_online, body)
                    status_response(true, status_code, sjson.encode(body))
                else 
                    error("Can't reach device") 
                end
            end)
            print(pcall_stat, err)
            print(1, response[2])
            if (not pcall_stat) then 
                status_response(false, err, nil)
            end
            print(3, response[1], response[2])
            send_response(sock)
        end)
    else 
        error("bad request")
    end
    print(11, response_data)
end
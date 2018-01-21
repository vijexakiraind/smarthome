print("App running")

devices_online = {} 
-- table of all variables that can be sent to frontend (except devices list)
variable_registry = {}

-- parsing clients datafile
clients_data = {} 
if file.open("clients_datafile.json", "r") then
    local raw_data = file.read()
    file.close()
    -- cutting comments
    raw_data = string.match(raw_data, "%[.+")
    clients_data = sjson.decode(raw_data)
end

for i, device in ipairs(clients_data) do
    local waiting_flag = true 
    print(device.ip)

    print("ggggg")
    local socket = net.createConnection(net.TCP)
    socket:connect(80, device.ip)
    socket:on("connection", function()
        print("blyacon"..device.ip)
        socket:send("espping\nespbatya\n")
        socket:on("receive", function(s, data)
            print("receive"..data)
            if(pcall(function() data = sjson.decode(data) end )) then
                local status_code, err = pcall(function() 
                    if(data.data.mac == device.mac) then 
                        print("SUCCESS!!!")
                    end 
                end)
            end
        end)
    end)
    socket:on("sent", function()
        print("blya"..device.ip)
    end)
    -- if device answers
    --[[http.get("http://"..device.ip.."/espping", nil, function(status_code, body)
        print(device.ip, status_code, body)
        waiting_flag = false
        local status, err = pcall(function()
            body = sjson.decode(body)
            print(device.mac)
            if body.mac == device.mac then
                table.insert(devices_online, device)
            else error("wrong mac") end
        end)
        if(not err) then print(status, err) end
    end)
    -- if device does not respond
    tmr.create():alarm(7000, tmr.ALARM_SINGLE, function()
        if(waiting_flag == true) then print(device.ip.." does not present") end
    end) --]]
end

web_srv = net.createServer(net.TCP, 30)
web_srv:listen(80, function(conn)

    local response = {}
    table.insert(response, base_headers..content_type["json"].."\r\n\r\n")
    
    -- if false - response sends automatically
    delayed_response = false
    
    api_tables = {
        variableregistry = variable_registry,
        devices = clients_data, 
        devicesonline = devices_online
    }

    --[[
        RESPONSE SENDING
    --]]
    function send_response(sock)
        if #response>0 then 
            sock:send(table.remove(response, 1))
        else
            sock:close()
        end
    end

    conn:on("sent", send_response)

    --[[
        DATA RECEIVING
    --]]
    conn:on("receive", function(sock, data)
        local request = string.match(data, "%s(/.-)%s")
        print("STA web "..string.match(data, "(.-)\n"))
        print(request)
        data = string.match(data, "\r\n\r\n(.+)")
        api(data, request, sock, response)
        if (not delayed_response) then
            send_response(sock, response)
        end
    end)
end)

print("Memory available: "..node.heap())
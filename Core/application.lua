print("App running")

-- table of all variables that can be sent to frontend (except devices list)
variable_registry = {}

-- parsing clients datafile
clients_data = {} -- max 4 clients
if file.open("clients_datafile.json", "r") then
    local raw_data = file.read()
    file.close()
    -- cutting comments
    raw_data = string.match(raw_data, "%[.+")
    clients_data = sjson.decode(raw_data)
end

clients_online = {{},{},{},{}} -- max 4 clients
disconnected_by_system = false -- flag to understand reason of disconnecting in disconnect event
wifi_ap_connect_event = function(T) 
    tmr.create():alarm(1500, tmr.ALARM_SINGLE, function()
        for mac,ip in pairs(wifi.ap.getclient()) do
            if mac == T.MAC then            
                print("Client connected: "..T.MAC.." "..ip)
                local i = 0
                repeat
                    i = i + 1
                until (mac == clients_data[i]["mac"]) or (i==4)
                if (mac == clients_data[i]["mac"]) then 
                    print("Known client, it's a "..clients_data[i]["name"].."!")
                    clients_online[i]["ip"] = ip 
                else
                    print("Unknown client... Disconnecting") 
                    disconnected_by_system = true
                    wifi.ap.deauth(mac)
                end
                
                break
            end
        end
    end)
end

wifi_ap_disconnect_event = function(T)
    if not disconnected_by_system then 
        for i=1,4 do 
            if (clients_data[i]["mac"] == T.MAC) then 
                print("Client disconnected: "..T.MAC.." ("..clients_data[i]["name"]..")")
                clients_online[i] = {}
            end
        end
    else
        print("Disconnected")
        -- reset flag
        disconnected_by_system = false 
    end
end

-- AP events
wifi.eventmon.register(wifi.eventmon.AP_STACONNECTED, wifi_ap_connect_event)
wifi.eventmon.register(wifi.eventmon.AP_STADISCONNECTED, wifi_ap_disconnect_event)

web_srv = net.createServer(net.TCP, 30)
web_srv:listen(80, function(conn)
    -- filenames for response building (http headers + data)
    local base_headers = "HTTP/1.1 200 OK\nCache-Control: no-cache\nContent-Type: "
    local content_type = {
        html = "text/html; charset=UTF-8",
        css = "text/css; charset=UTF-8",
        js = "application/javascript; charset=UTF-8",
        ico = "image/x-icon",
        png = "image/png",
        json = "application/json; charset=UTF-8"
    }
    local api_tables = {
        variableregistry = variable_registry,
        devices = clients_data, 
        devicesonline = clients_online
    }

    local response = {}
    local function make_api_response(request)
        -- api call looks like /q/devices
        request = string.match(request, "/q/(.+)")
        response[1] = base_headers..content_type["json"].."\r\n\r\n"
        local encoder
        -- reading api
        if (pcall(function() encoder = sjson.encoder(api_tables[request]) end)) then
            print("Reading api")
            response[2] = "{\"status\":\"ok\",\"data\":"
            repeat
                local chunk = encoder:read()
                print(chunk)
                table.insert(response, chunk)
            until chunk ~= nil
            table.insert(response, "}")
        else
            print("!!!Bad request: "..(request or "nil"))
            table.insert(response, "{\"status\":\"bad request\"}")
        end
        return response
    end

    local function exec_api(data, request) 
        response[1] = base_headers..content_type["json"].."\r\n\r\n"
        local function ok_response()
            response[2] = "{\"status\":\"ok\"}"
        end
        local function bad_response(status)
            response[2] = "{\"status\":\""..status.."\"}"
        end

        print(data)
        data = string.match(data, "\r\n\r\n(.+)")
        print("Data incoming: "..data)
        local pcall_stat, err
        if(request == "/r/changedevices") then
            pcall_stat, err = pcall(function() 
                clients_data = sjson.decode(data)
                file.open("clients_datafile.json", "w+")
                file.write(data)
                file.close()
            end)
            print(pcall_stat, err)
        else 
            pcall_stat = false
            err = "bad request"
        end
        if (pcall_stat) then
            ok_response()
        else
            bad_response(err)
        end
    end

    local function send_response(sock)
        if #response>0 then 
            sock:send(table.remove(response, 1))
        else
            sock:close()
        end
    end

    conn:on("sent", send_response)

    conn:on("receive", function(sock, data)
        local request_type = string.match(data, "(%a+)%s")
        local request = string.match(data, "%s(/.-)%s")
        print("STA web "..string.match(data, "(.-)\n"))
        print(request)
        if request_type == "GET" then
            make_api_response(request)
        elseif request_type == "POST" then
            exec_api(data, request)
        end
        send_response(sock)
    end)
end)

print("Memory available: "..node.heap())
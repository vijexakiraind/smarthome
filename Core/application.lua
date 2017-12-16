print("App running")

-- table of all variables that can be sent to frontend (except devices list)
variable_registry = {}

-- parsing clients datafile
clients_data = {} -- max 4 clients
if file.open("clients_datafile.json", "r") then
    local raw_data = file.read()
    file.close()
    -- cutting comments
    raw_data = string.sub(raw_data, string.match(raw_data, "(#.-)%["):len()+1, raw_data:len())
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
    local base_headers = "HTTP/1.1 200 OK\nCache-Control: no-cache\n"
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
    local function make_response(filename)
        print("File name "..filename)
        local type
        if filename=="/" then 
            filename = "page.html"
        else
            filename = string.match(filename, "/(.+)")
        end
        type = string.match(filename, "%.(%a+)")
        print(type)
        -- making http headers and checking for bad request
        if pcall(function() response[1] = base_headers..content_type[type].."\n\n" end) then
            if file.open(filename, "rb") then
                while file.seek(cur, 0) < file.stat(filename).size do
                    table.insert(response, file.read(1024))
                end
                file.close()
            end
        -- parsing api calls
        else
            -- api call looks like q/devices
            filename = string.match(filename, "q/(.+)")
            response[1] = base_headers..content_type["json"].."\n\n"
            local encoder
            -- reading api
            if (pcall(function() encoder = sjson.encoder(api_tables[filename]) end)) then
                print("Reading api")
                repeat
                    local chunk = encoder:read()
                    print(chunk)
                    table.insert(response, chunk)
                until chunk ~= nil
            else
                print("!!!Bad request: "..(filename or "nil"))
            end
        end
        return response
    end

    local function exec_api(data, request) 
        if(request == "changedevices") then
            
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
        local request_type = string.match(data, "%a+%s")
        local request = string.match(data, "%s(/.-)%s")
        local response 
        print("STA web "..string.match(data, ".-/n"))
        if request_type == "GET" then
            response = make_response(request)
        elseif request_type == "POST" then
            response = exec_api(data, request)
        end
        send_response(sock, response)
    end)
end)
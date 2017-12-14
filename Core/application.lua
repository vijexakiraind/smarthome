print("App running")

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
    local filenames = {
        html = "web_server_html_headers.txt page.html",
        css = "web_server_css_headers.txt page.css",
        favicon = "web_server_favicon_headers.txt favicon.png"
    }

    local response = {}
    local function make_response(type)
        
        if file.open(string.match(filenames[type], "(.+)%s"), "r") then 
            -- first block is headers
            response[1] = file.read().."\n"
            file.close()
        end
        filename = string.match(filenames[type], "%s(.+)")
        if file.open(filename, "rb") then
            while file.seek(cur, 0) < file.stat(filename).size do
                print("Reading "..node.heap())
                table.insert(response, file.read(1024))
            end
            file.close()
        end
        return response
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
        local request = string.match(data, "%s(/.-)%s")
        local response 
        print("STA web "..request)
        print("Before reading "..node.heap())
        if request == "/page.css" then
            response = make_response("css")
        elseif request == "/favicon.ico" then
            response = make_response("favicon")
        else
            response = make_response("html")
        end
        print("Before sending "..node.heap())
        send_response(sock, response)
    end)
end)
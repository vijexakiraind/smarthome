print("App running")

-- parsing clients datafile
clients_data = {{},{},{},{}} -- max 4 clients
if file.open("clients_datafile.txt", "r") then
    local raw_data = file.read()
    file.close()
    -- cutting first two strings
    raw_data = string.sub(raw_data, string.match(raw_data, ".-\n.-\n"):len()+1, raw_data:len())
    local i = 1
    while (raw_data:len()>0) do 
        clients_data[i]["mac"] = string.match(raw_data, "$(.-)%s")
        clients_data[i]["name"] = string.match(raw_data, "#(.-)%s")
        clients_data[i]["description"] = string.match(raw_data, "@(.-)\n")
        raw_data = string.sub(raw_data, string.match(raw_data, ".-\n"):len()+1, raw_data:len())
        i = i + 1
    end
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

-- filenames for response building (http headers + data)
filenames = {
    html = "web_server_html_headers.txt page.html",
    css = "web_server_css_headers.txt page.css",
    favicon = "web_server_favicon_headers.txt favicon.png"
}

function make_response(type)
    response = nil
    if file.open(string.match(filenames[type], "(.+)%s"), "r") then 
        response = file.read().."\n"
        file.close()
    end
    filename = string.match(filenames[type], "%s(.+)")
    if file.open(filename, "rb") then
        while file.seek(cur, 0) < file.stat(filename).size do
            response = response..file.read()
        end
        file.close()
    end
    return response
end

web_srv = net.createServer(net.TCP, 30)
web_srv:listen(80, function(conn)

    conn:on("receive", function(sock, data)
        request = string.match(data, "%s(/.-)%s")
        print("STA web "..request)
        if request == "/page.css" then
            sock:send(make_response("css"))
        elseif request == "/favicon.ico" then
            sock:send(make_response("favicon"))
        else
            sock:send(make_response("html"))
        end
    end)
    
    conn:on("sent", function (c) c:close() end)
end)

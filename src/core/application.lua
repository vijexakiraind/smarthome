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

web_srv = net.createServer(net.TCP, 30)
web_srv:listen(80, function(conn)
    -- if false - response sends automatically
    local delayed_response = false
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
        devicesonline = devices_online
    }

    local response = {}

    --[[
        GET API
    --]]
    local function GET_api(request)
        -- api call looks like /q/devices
        request = string.match(request, "/q/(.+)")
        response[1] = base_headers..content_type["json"].."\r\n\r\n"
        local encoder
        -- reading api
        response[2] = "{\"status\":\"success\",\"data\":" -- success state for default
        if (pcall(function() encoder = sjson.encoder(api_tables[request]) end)) then
            print("Reading api")
            repeat
                local chunk = encoder:read()
                print(chunk)
                table.insert(response, chunk)
            until chunk ~= nil
            table.insert(response, "}")
        elseif (request == "searchfordevices") then

        else
            print("!!!Bad request: "..(request or "nil"))
            response[2] = "{\"status\":\"bad request\"}"
        end
        return response
    end

    --[[
        POST API
    --]]
    local function POST_api (data, request, sock) 
        response[1] = base_headers..content_type["json"].."\r\n\r\n"

        local function status_response(status, status_code, response_data)
            if (status_code == "") or (status_code == nil) then status_code = 0 end
            if (response_data == nil) then response_data = {} end
            if (status) then
                response[2] = "{\"status\":\"success\", \"status_code\":\""..status_code.."\",\"data\":\""..sjson.encode(response_data).."\"}"
            else
                response[2] = "{\"status\":\"error\", \"status_code\":\""..status_code.."\"}"
            end
        end

        print(data)
        data = string.match(data, "\r\n\r\n(.+)")
        print("Data incoming: "..data)
        local pcall_stat, err
        pcall_stat, err = pcall(function() 
            if (request == "/q/changedevices") then
                clients_data = sjson.decode(data)
                file.open("clients_datafile.json", "w+")
                file.write(data)
                file.close()
            elseif (request == "/q/connectdevice") then
                data = sjson.decode(data)
                delayed_response = true
                http.get("http://"..data["ip"].."/connect", nil, function(status_code, body)
                    pcall_stat, err = pcall(function()
                        delayed_response = false
                        print(status_code)
                        if (not pcall(function() body = sjson.decode(body) end)) or (body["client"]~="esp8266") then error("Got wrong answer from device. Check your firmware.") end
                        body["client"] = nil
                        if(status_code ~= -1) then
                            table.insert(devices_online, body)
                            status_response(true, status_code, body)
                        else 
                            error("Can't reach device") 
                        end
                    end)
                    if (not pcall_stat) then 
                        status_response(false, err, nil)
                    end
                    send_response(sock)
                end)
            else 
                error("bad request")
            end
        end)
        if (not delayed_response) then
            print(pcall_stat, err)
            status_response(pcall_stat, err, nil)
        end
    end

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
        local request_type = string.match(data, "(%a+)%s")
        local request = string.match(data, "%s(/.-)%s")
        print("STA web "..string.match(data, "(.-)\n"))
        print(request)
        if request_type == "GET" then
            GET_api(request)
        elseif request_type == "POST" then
            POST_api(data, request, sock)
        end
        if (not delayed_response) then
            send_response(sock)
        end
    end)
end)

print("Memory available: "..node.heap())
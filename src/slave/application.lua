print("Slave application running...")

variable_registry = {}

web_srv = net.createServer(net.TCP, 30)
web_srv:listen(80, function(conn)

    local response = {}

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
        api(data, request, sock, response)
        if (not delayed_response) then
            send_response(sock, response)
        end
    end)
end)

print("Memory available: "..node.heap())
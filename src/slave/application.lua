print("Slave application running...")

variable_registry = {}

function ignore(conn)
    print("ignoring...")
    conn:close()
end

function listen(conn)
    web_srv:close()
    web_srv:listen(80, ignore)
    conn:on("disconnection", function() 
        print("disconnected")
        web_srv:close()
        web_srv:listen(80, listen) 
    end)

    local response = {}
    -- if false - response sends automatically
    delayed_response = false
    


    --[[
        RESPONSE SENDING
    --]]
    function send_response(sock)
        if #response>0 then 
            print("sending")
            sock:send(table.remove(response, 1))
        end
    end

    conn:on("sent", send_response)

    --[[
        DATA RECEIVING
    --]]
    conn:on("receive", function(sock, data)
        local request = string.match(data, "(.-)\n")
        data = string.match(data, "\n(.-)\n")
        print(request, data)
        api(data, request, sock, response)
        if (not delayed_response) then
            send_response(sock, response)
        end
    end)
end

web_srv = net.createServer(net.TCP, 5)
web_srv:listen(80, listen)

print("Memory available: "..node.heap())
function api_core(data, request, sock, status_response, response, response_data) 
    -- get global variables
    print(request)
    print(data, data=="espbatya")
    if (request == "espping") then
        if(data == "espbatya") then
            response_data.string = sjson.encode( {["mac"]=wifi.sta.getmac()} )
        else
            error("close")
        end
    else 
        error("bad request")
    end
    print(11, response_data)
end
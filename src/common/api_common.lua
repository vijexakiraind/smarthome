--[[
    POST API
--]]
function api (data, request, sock, response) 
    local response_data = {}

    local function status_response(status, status_code, response_data)
        if (status_code == "") or (status_code == nil) then status_code = 0 end
        if (response_data == nil) then response_data = {["string"] = ""} end
        -- if response_data is a string
        if (not pcall(function() response_data.test = "test" end)) then response_data = {["string"] = response_data} end
        if (status) then
            table.insert(response, "{\"status\":\"success\", \"status_code\":\""..status_code.."\",\"data\":"..response_data.string.."}")
        else
            table.insert(response, "{\"status\":\"error\", \"status_code\":\""..status_code.."\"}")
        end
    end

    local pcall_stat, err
    -- calls api function from api_core.lua
    pcall_stat, err = pcall(api_core, data, request, sock, status_response, response, response_data)
    if (err ~= "close") then
        if (not delayed_response) then
            print(pcall_stat, err)
            status_response(pcall_stat, err, response_data)
        end
    else 
        sock:close()
    end
    return response
end
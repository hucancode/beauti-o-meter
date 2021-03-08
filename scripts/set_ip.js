var client_ip = "127.0.0.1";
function setIP(json)
{
    client_ip = json.ip;
    if (typeof onIPReady === 'function')
    {
        onIPReady(client_ip);
    }
}
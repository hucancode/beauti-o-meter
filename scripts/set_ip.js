function setIP(json)
{
    if (typeof onIPReady === 'function')
    {
        onIPReady(json.ip);
    }
}
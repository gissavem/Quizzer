
export function handleResponse(response) 
{
    return response.text()
        .then(text => 
    {
        const data = text && JSON.parse(text);
        
        if (!response.ok) 
        {
            return Promise.reject(data);
        }

        return data;
    });
}
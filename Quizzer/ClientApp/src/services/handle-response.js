export function handleResponse(response) 
{
    return response.text()
        .then((text) => 
    {
        const data = text && JSON.parse(text);

        if ([401, 403, 405].indexOf(response.status) !== -1){
            return Promise.reject({statusCode : 401, message : "Unauthorized"})
        }

        if (!response.ok) 
            return Promise.reject(data);
        
        return data;
    });
}
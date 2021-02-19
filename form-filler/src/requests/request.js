import endpoints from './endpoints'; 

const SERVER = ""; // <-- Replace with main server path

export default function send(request , data = {}, path_extension = null) {
    const endpoint = endpoints[request];
    
    if (endpoint) {
        // endpoint exists
        let path = SERVER + endpoint.endpoint;
        if (path_extension !== null) {
            path = path + path_extension;
        }
    

        const options = {
            method: endpoint.method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        if (endpoint.method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        return fetch(path, options);

    } else {
        return Promise.resolve();
    }
}
interface Response {
    body:any,
    status:number
}

interface Request {
    body:any,
}

export class HttpExtendedClient { 
    async get(url:string , options?:Request):Promise<Response> {
        const response = await fetch(url, {
            method:"GET",
        })
        return {
            body:await response.json(),
            status:response.status
        }
    }
    async post(url:string , options:Request):Promise<Response> {
        const response = await fetch(url, {
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(options.body || {})
        })
        return {
            body:await response.json(),
            status:response.status
        }
    }
}
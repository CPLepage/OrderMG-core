import {Request} from "express";

export function getAccessTokenFromRequest(request: Request): string{
    return request.query.accessToken ? 
        request.query.accessToken as string : 
        request.headers.authorization as string
}

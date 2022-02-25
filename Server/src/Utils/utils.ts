import {Request} from "express";

export function getTokenFromRequest(request: Request): string{
    if(request.query.token)
        return request.query.token as string;

    return request.headers.token as string
}

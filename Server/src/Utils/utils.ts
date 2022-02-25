import {Request} from "express";

export function getAccessTokenFromRequest(request: Request): string{
    if(request.query.accessToken)
        return request.query.accessToken as string;

    return request.headers.authorization as string
}

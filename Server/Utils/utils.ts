import {Request} from "express";

export function getAccessTokenFromRequest(request: Request): string{
    return request.query.accessToken ?
        request.query.accessToken as string :
        request.headers.authorization as string
}

export function sleep(ms: number){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

export function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

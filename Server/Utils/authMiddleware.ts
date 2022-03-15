import {NextFunction, Request, Response} from "express";
import {getAccessTokenFromRequest} from "Server/Utils/utils";
import Server from "Server/Server";
import {ServiceEnum} from "Server/Services/Enum";
import Auth from "Server/Services/Auth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const accessToken = getAccessTokenFromRequest(req);
    const checkAuth = await (Server.services.get(ServiceEnum.AUTH) as Auth).auth(accessToken);

    if(checkAuth)
        return next();

    return res.json({statusCode: 401, error: "Unauthorized"});
}

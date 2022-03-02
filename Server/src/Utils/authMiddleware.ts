import {NextFunction, Request, Response} from "express";
import {getAccessTokenFromRequest} from "src/Utils/utils";
import Server from "src/Server";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const accessToken = getAccessTokenFromRequest(req);
    const checkAuth = await Server.services.get("auth").auth(accessToken);

    if(checkAuth)
        return next();

    return res.json({statusCode: 401, error: "Unauthorized"});
}

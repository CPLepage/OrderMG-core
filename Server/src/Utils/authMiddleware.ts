import {NextFunction, Request, Response} from "express";
import {getAccessTokenFromRequest} from "src/Utils/utils";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const accessToken = getAccessTokenFromRequest(req);
    //@overrideable
    const checkAuth = await auth(accessToken);

    if(checkAuth === null || checkAuth)
        return next();

    return res.json({statusCode: 401, error: "Unauthorized"});
}

import {NextFunction, Request, Response} from "express";
import {getTokenFromRequest} from "src/Utils/utils";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = getTokenFromRequest(req);
    const checkAuth = await auth({token: token});

    if(checkAuth === null || checkAuth)
        return next();

    return res.status(401).json({error: "Unauthorized"});
}

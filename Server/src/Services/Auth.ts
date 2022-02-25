import {Router} from "express";
import {authMiddleware} from "src/Utils/authMiddleware";


const router = Router();

// login attempt
router.get("/", async function(req, res) {
    //@overrideable
    return res.json(await login(req.query.username as string, req.query.password as string));
});

// validate an existing access token
router.get("/validate", authMiddleware, async function(req, res) {
    return res.json({valid: true});
});

// refresh an access token with the refresh token
router.get("/refreshToken", async function(req, res) {
    const token = {
        accessToken: req.headers.authorization as string,
        refreshToken: req.query.refreshToken as string
    }

    //@overrideable
    return res.json(await refreshToken(token));
});

// logout (invalidate refresh token)
router.get("/logout", authMiddleware, async function(req, res) {
    const token = {
        accessToken: req.headers.authorization as string,
        refreshToken: req.query.refreshToken as string
    }

    //@overrideable
    return res.json({success: await logout(token)});
});

export default router;

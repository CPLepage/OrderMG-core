import {Router} from "express";


const router = Router();

// login attempt
router.post("/login", async function(req, res) {
    //@overrideable
    return res.json(await login(req.query.username as string, req.query.password as string));
});

export default router;

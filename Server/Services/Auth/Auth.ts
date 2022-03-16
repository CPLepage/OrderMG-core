import {authMiddleware} from "Server/Utils/authMiddleware";
import Service from "Server/Services/Service";

export default class Auth extends Service {
    register(){
        const router = super.register();

        // login attempt
        router.get("/", async (req, res) => {
            return res.json(await this.login(req.query.username as string, req.query.password as string));
        });

        // validate an existing access token
        router.get("/validate", authMiddleware, async (req, res) => {
            return res.json({valid: true});
        });

        // refresh an access token with the refresh token
        router.get("/refreshToken", async (req, res) => {
            const token = {
                accessToken: req.headers.authorization as string,
                refreshToken: req.query.refreshToken as string
            }

            return res.json(await this.refreshToken(token));
        });

        // logout (invalidate refresh token)
        router.get("/logout", authMiddleware, async (req, res) => {
            const token = {
                accessToken: req.headers.authorization as string,
                refreshToken: req.query.refreshToken as string
            }

            return res.json({success: await this.logout(token)});
        });

        return router;
    }

    async login(username: string, password: string): Promise<Token> { return null; }

    async auth(accessToken: string): Promise<boolean> { return true; }

    async refreshToken(token: Token): Promise<Token> { return null; }

    async logout(token: Token): Promise<boolean> { return true; }
}

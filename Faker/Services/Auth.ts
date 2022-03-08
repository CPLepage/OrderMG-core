import Auth from "src/Services/Auth";
import Server from "src/Server";
import {ServiceEnum} from "src/Services/Enum";

class fakerAuthService extends Auth {
    readonly fakeUserPass = "ordermg";
    readonly fakeRefreshToken = "ordermg-token";

    async login(username: string, password: string): Promise<Token> {
        return username === this.fakeUserPass && password === this.fakeUserPass ?
            {accessToken: Date.now().toString(), refreshToken: this.fakeRefreshToken} : null;
    }

    // we'll invalidate our accessToken every ten seconds to test refreshing
    async auth(accessToken: string): Promise<boolean> {
        const accessTokenTimestamp = Number(accessToken);
        return Date.now() - accessTokenTimestamp < (1000 * 10);
    }

    async refreshToken(token: Token): Promise<Token> {
        return token.refreshToken === this.fakeRefreshToken ?
            {accessToken: Date.now().toString(), refreshToken: this.fakeRefreshToken} : null;
    }
}

Server.services.set(ServiceEnum.AUTH, new fakerAuthService());

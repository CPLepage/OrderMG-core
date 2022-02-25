const fakeUserPass = "ordermg";
const fakeRefreshToken = "ordermg-token";

global.login = async function(username: string, password: string) {
    return username === fakeUserPass && password === fakeUserPass ?
        {accessToken: Date.now(), refreshToken: fakeRefreshToken} : null;
};

// we'll invalidate our accessToken ten seconds to test refreshing
global.auth = async function(accessToken: string) {
    const accessTokenTimestamp = Number(accessToken);
    return Date.now() - accessTokenTimestamp < 1000 * 10;
};

global.refreshToken = async function(token: {accessToken: string, refreshToken: string}) {
    return token.refreshToken === fakeRefreshToken ?
        {accessToken: Date.now(), refreshToken: fakeRefreshToken} : null;
}

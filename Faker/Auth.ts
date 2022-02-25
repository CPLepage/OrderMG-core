import "../Server/types";

const fakeUserPass = "ordermg";
const fakeToken = "ordermg-token";

global.login = function(username: string, password: string) {
    return username === fakeUserPass && password === fakeUserPass ? {token: fakeToken} : null;
};

global.auth = function(tokenObj: Token) {
    return tokenObj.token === fakeToken;
};

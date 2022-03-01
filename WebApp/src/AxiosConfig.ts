import axios, {AxiosResponse} from "axios";
import {blobToText} from "Utils/utils";

async function refreshAccessToken(refreshToken: string): Promise<Token> {
    try{
        return (await axios.get(`/auth/refreshToken?refreshToken=${refreshToken}`)).data;
    }catch (e) {
        return null;
    }
}

async function retryRequest(request){
    const extraConfig: any = {};
    if(request.responseType)
        extraConfig.responseType = request.responseType;

    switch (request.method) {
        case "get" :
            return await axios.get(request.url, extraConfig);
        case "put" :
            return await axios.put(request.url, JSON.parse(request.data), extraConfig);
        case "post" :
            return await axios.post(request.url, JSON.parse(request.data), extraConfig);
        case "delete" :
            return await axios.delete(request.url, JSON.parse(request.data));
        default: {
            return console.log("Unknown method for request " + request);
        }
    }
}

let accessTokenRefreshingGuard;

//  wait for accessToken to refresh
function waitForAccessTokenToRefresh() {
    return new Promise(res => {
        let waitingInterval = setInterval(() => {
            if (!accessTokenRefreshingGuard) {
                clearInterval(waitingInterval);
                res(true);
            }
        }, 100);
    });
}

async function axiosResponseInterceptor(response: AxiosResponse) {
    // return response for refreshToken
    if(response.config.url.match(/\/refreshToken/))
        return response;

    // get data response.
    // convert blob to json if we requested blob and receive JSON error message
    const dataTest = response.data instanceof Blob && response.data.type === "application/json" ?
        JSON.parse(await blobToText(response.data)) : response.data;

    // the failed signal isn't present, we're good
    if(!dataTest || dataTest.statusCode !== 401)
        return response;

    // keep our failed request to retry after refreshing accessToken
    const failedRequest = response.config;

    // already refreshing
    if(accessTokenRefreshingGuard) {
        await waitForAccessTokenToRefresh();
        return await retryRequest(failedRequest);
    }

    // lock refreshing guard
    accessTokenRefreshingGuard = true;

    // try to refresh token
    const refreshToken = window.localStorage.getItem("refreshToken");
    const token: Token = await refreshAccessToken(refreshToken);

    // failed to refresh, go to login
    if(!token || !token.accessToken){
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        return window.location.href = "/login";
    }

    // keep new tokens
    window.localStorage.setItem("accessToken", token.accessToken);
    if(token.refreshToken)
        window.localStorage.setItem("refreshToken", token.refreshToken);

    // set auth header
    axios.defaults.headers.common['Authorization'] = token.accessToken;

    // unlock guard
    accessTokenRefreshingGuard = false

    // retry request
    return await retryRequest(failedRequest);
}

export default async function(accessToken: string): Promise<void> {
    axios.defaults.headers.common['Authorization'] = accessToken;

    // response middleware
    axios.interceptors.response.use(axiosResponseInterceptor, (error) => Promise.reject(error));

    // validate auth, if failed, response interceptor will try to refresh
    await axios.get(`/auth/validate`);
}

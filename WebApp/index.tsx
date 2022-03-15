import React from 'react';
import {render} from "react-dom";
import {changeLang, renderPromise} from "WebApp/Utils/utils";
import axios from "axios";
import i18next, {t} from "i18next";
import constants from "Shared/constants";

const renderContainer = document.getElementById("root");
const centerContainerStyle = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

// set baseURL for Services and determines whether to login ou start the app
async function main(){
    if(process.env.CONSTANTS_FILE)
        await import(process.env.CONSTANTS_FILE);

    axios.defaults.baseURL = "/api";

    await renderPromise(<div style={centerContainerStyle}>{t("Initializing")}</div>, renderContainer);
    await initLang();

    return window.location.pathname.match(/^\/login\/?$/) ? login() : start();
}

async function initLang(){
    await i18next.init({lng: 'en', defaultNS: 'WebApp', fallbackLng: 'en'});
    const availableLanguages = (await axios.get("/lang")).data;
    if(constants.defaultLang === "en" || !availableLanguages.includes(constants.defaultLang))
        return;

    await changeLang(constants.defaultLang);
}

// async import login and render
async function login(){
    const LoginView = (await import("WebApp/Login")).default;
    render(<LoginView />, renderContainer);
}

// start app!
async function start(){
    const savedAccessToken = window.localStorage.getItem("accessToken");

    await renderPromise(<div style={centerContainerStyle}>{t("Authenticating")}</div>, renderContainer);

    // configure axios, it sets up the accessToken
    const axiosConfigurator = (await import("WebApp/AxiosConfig")).default
    await axiosConfigurator(savedAccessToken);

    // async import the view router and render
    const ViewRouter = (await import("WebApp/ViewRouter/Router")).default;
    render(<ViewRouter />, renderContainer);
}

main();

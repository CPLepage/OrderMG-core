import React from 'react';
import {render} from "react-dom";
import {renderPromise} from "Utils/utils";
import axios from "axios";

const renderContainer = document.getElementById("root");

// set baseURL for Services and determines whether to login ou start the app
function main(){
    axios.defaults.baseURL = "/api";

    return window.location.pathname.match(/^\/login\/?$/) ? login() : start();
}

// async import login and render
async function login(){
    const LoginView = (await import("Login")).default;
    render(<LoginView />, renderContainer);
}

// start app!
async function start(){
    const savedAccessToken = window.localStorage.getItem("accessToken");

    await renderPromise("Authenticating", renderContainer);

    // configure axios, it sets up the accessToken
    const axiosConfigurator = (await import("AxiosConfig")).default
    await axiosConfigurator(savedAccessToken);

    // async import the view router and render
    const ViewRouter = (await import("ViewRouter/Router")).default;
    render(<ViewRouter />, renderContainer);
}

main();

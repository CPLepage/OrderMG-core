import React from 'react';
import {render} from "react-dom";
import Login from "Views/Login";
import {renderPromise} from "Utils/utils";
import axios from "axios";
import Router from "ViewRouter/Router";

const renderContainer = document.getElementById("root");

async function main(){
    axios.defaults.baseURL = "/api";

    const savedAccessToken = window.localStorage.getItem("accessToken");

    if(!savedAccessToken)
        return render(<Login />, renderContainer);

    await renderPromise("Authenticating", renderContainer);

    const axiosConfigurator = (await import("AxiosConfig")).default
    await axiosConfigurator(savedAccessToken);

    render(<Router />, renderContainer);
}

main();

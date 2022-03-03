import React from "react";
import axios from "axios";
import constants from "@shared/constants";

export default class extends React.Component {
    usernameRef = React.createRef<HTMLInputElement>();
    passwordRef = React.createRef<HTMLInputElement>();

    componentDidMount() {
        return this.checkIfAlreadyLoggedIn();
    }

    async checkIfAlreadyLoggedIn(){
        const accessToken = window.localStorage.getItem("accessToken");
        const validation = (await axios.get("/auth/validate", {headers: {authorization: accessToken}})).data;
        if(validation.valid)
            return window.location.href = "/";
    }

    async login(event){
        event.preventDefault();

        const username = this.usernameRef.current.value;
        const password = this.passwordRef.current.value;

        const token: Token = (await axios.get(`/auth?username=${username}&password=${password}`)).data;

        if(token && token.accessToken){
            window.localStorage.setItem("accessToken", token.accessToken);

            if(token.refreshToken)
                window.localStorage.setItem("refreshToken", token.refreshToken);

            window.location.href = "/";
        }
    }

    render(){
        return <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: constants.backgroundColor
        }}>
            <form style={{
                height: "calc(100% - 12px)",
                width: "calc(100% - 12px)",
                maxHeight: 500,
                maxWidth: 400,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white"
            }} onSubmit={this.login.bind(this)}>


                <label htmlFor={"email"}>Email/Username:</label>
                <input ref={this.usernameRef} name={"email"} type={"text"} />

                <label htmlFor={"password"}>Password:</label>
                <input ref={this.passwordRef} name={"password"} type={"password"} />

                <input type={"submit"} value={"Login"}/>
            </form>
        </div>
    }
}

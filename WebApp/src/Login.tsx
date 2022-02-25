import React from "react";
import axios from "axios";

export default class extends React.Component {
    usernameRef = React.createRef<HTMLInputElement>();
    passwordRef = React.createRef<HTMLInputElement>();

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
        return <form onSubmit={this.login.bind(this)}>
            <input ref={this.usernameRef} type={"text"} />
            <input ref={this.passwordRef} type={"password"} />
            <input type={"submit"}/>
        </form>
    }
}

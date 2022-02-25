import React from "react";

export default class extends React.Component {
    usernameRef = React.createRef<HTMLInputElement>();
    passwordRef = React.createRef<HTMLInputElement>();

    async login(event){
        event.preventDefault();

        const username = this.usernameRef.current.value;
        const password = this.passwordRef.current.value;

        const response = await fetch(`/api/login?username=${username}&password=${password}`, {
            method: 'POST'
        });

        const tokenObject = await response.json();
        if(tokenObject && tokenObject.token){
            window.localStorage.token = tokenObject.token;
            return window.location.reload();
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

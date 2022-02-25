import React from 'react';
import {render} from "react-dom";
import Login from "Login/Login";

render(window.localStorage.token ? <h1>Welcome to OrderMG</h1> : <Login />, document.getElementById("root"));

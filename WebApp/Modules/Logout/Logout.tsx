import React from "react";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import axios from "axios";
import {render} from "react-dom";

function renderLoggingOutView(){
    render(<div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}>
        Logging Out...
    </div>, document.getElementById("root"));
}

export default function() {
    return <Button id={"logout"} variant={"danger"} onClick={async () => {
        renderLoggingOutView();

        await axios.get("/auth/loggout");

        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");

        window.location.href = "/";
    }}><FontAwesomeIcon icon={faArrowRightFromBracket} /></Button>
}

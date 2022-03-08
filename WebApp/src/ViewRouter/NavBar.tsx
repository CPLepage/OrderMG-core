import React, {ReactElement} from "react";
import constants from "@shared/constants";
import Logout from "Modules/Logout";
import Nav from "react-bootstrap/Nav";
import {isColorLight} from "Utils/utils";


export default function (props: {height: number, children: ReactElement[]}){
    const linkColor = isColorLight(constants.backgroundColor) ? constants.textColorDark : constants.textColorLight;
    return <div style={{
        height: props.height,
        width: "100%",
        backgroundColor: constants.backgroundColor,
        boxSizing: "border-box",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }}>
        <Nav>
            {props.children.map((viewItem, index) =>
                <Nav.Link style={{color: linkColor}} key={"view-item-" + index} as={"span"}>{viewItem}</Nav.Link>)}
        </Nav>
        <Logout />
    </div>
}

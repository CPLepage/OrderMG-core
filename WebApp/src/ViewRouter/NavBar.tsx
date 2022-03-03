import React from "react";
import constants from "@shared/constants";

export default function ({height, children}){
    return <div style={{
        height: height,
        width: "100%",
        backgroundColor: constants.backgroundColor
    }}>{children}</div>
}

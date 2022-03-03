import React from "react";
import constants from "@shared/constants";

export default function ({progress}) {
    return <div style={{
        width: "100%",
        height: 8,
        overflow: "hidden",
        borderRadius: 8,
        maxWidth: 250,
        border: "1px solid gray"
    }}>
        <div style={{
            width: progress * 100 + "%",
            borderRadius: 8,
            height: "100%",
            backgroundColor: constants.accentColor,
            transition: "0.3s width"
        }}/>
    </div>
}

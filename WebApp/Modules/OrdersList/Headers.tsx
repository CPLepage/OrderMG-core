import React from "react";
import constants from "Shared/constants";
import Cell from "WebApp/Modules/OrdersList/Cell";
import styled from "styled-components";

export default function(props: {columns: Column[]}) {
    return <div style={{
        backgroundColor: "lightgray",
        height: "100%",
        width: "100%",
        color: constants.textColorDark
    }}>
        {props.columns.map(column => <>
            <Cell column={column}>{column.header}</Cell>
            <Resizer />
        </>)}
    </div>
}

const Resizer = styled.div`
  display: inline-block;
  height: 100%;
  width: 2px;
  background-color: gray;
`;

import React, {CSSProperties, ReactElement} from "react";
import styled from "styled-components";

export default function(props: {
    column: Column,
    children: any,
    style?: CSSProperties
}){
    let style = props.style ?? {};

    style.width = props.column.defaultWidth ?? 100;

    return <Cell style={style}>{props.children}</Cell>
}

const Cell = styled.div`
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

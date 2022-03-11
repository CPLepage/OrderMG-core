import React, {ReactElement} from "react";
import constants from "@shared/constants";
import Logout from "Modules/Logout";
import Nav from "react-bootstrap/Nav";
import {isColorLight} from "Utils/utils";
import styled from "styled-components";

const NavItem = styled.span`
  opacity: 0.7;
  color: ${props => props.color};
  &:hover {
    opacity: 1;
  }
`;

export default class extends React.Component {
    props: {
        height: number,
        defaultActiveViewIndex: number,
        children: ReactElement[]
    }
    state: {
        active: number
    } = {
        active: this.props.defaultActiveViewIndex
    }

    render(){
        const linkColor = isColorLight(constants.backgroundColor) ? constants.textColorDark : constants.textColorLight;

        return <div style={{
            height: this.props.height,
            width: "100%",
            backgroundColor: constants.backgroundColor,
            boxSizing: "border-box",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <Nav>
                {this.props.children.map((viewItem, index) =>
                    <Nav.Link key={"view-item-" + index} as={"span"}>
                        <NavItem color={linkColor}
                                 style={{opacity: this.state.active === index ? 1 : null}}
                                 onClick={() => this.setState({active: index})}>{viewItem}</NavItem>
                    </Nav.Link>)}
            </Nav>
            <div>{window.localStorage.getItem("accessToken") ? <Logout /> : null}</div>
        </div>
    }
}

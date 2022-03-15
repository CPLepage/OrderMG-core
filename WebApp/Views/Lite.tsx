import React from "react";
import OrdersList from "WebApp/Modules/OrdersList/OrdersList";

export default class extends React.Component {
    render(){
        return <div style={{
            display: "flex",
            height: "100%"
        }}>
            <div style={{width: 300, borderRight: "1px solid lightgray"}}><OrdersList /></div>
            <div style={{width: "calc(100% - 300px)"}}>Allo</div>
        </div>;
    }
}

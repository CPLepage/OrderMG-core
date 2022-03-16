import React from "react";
import constants from "Shared/constants";
import getValue from "Shared/Utils/getValue";
import Cell from "WebApp/Modules/OrderList/Cell";
import CalcListWidth from "WebApp/Modules/OrderList/CalcListWidth";

export default class extends React.Component {
    props: {
        order: Order
    }

    render() {
        return <div style={{width: CalcListWidth()}}>
            {constants.defaultColumns.map(column =>
                <Cell column={column}>{getValue(this.props.order, column.path)}</Cell>)}
        </div>;
    }
}

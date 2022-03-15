import React from "react";
import constants from "Shared/constants";
import getValue from "Shared/Utils/getValue";
import Cell from "WebApp/Modules/OrdersList/Cell";

export default class extends React.Component {
    props: {
        order: Order
    }

    render() {
        return <div>
            {constants.defaultColumns.map(column =>
                <Cell column={column}>{getValue(this.props.order, column.path)}</Cell>)}
        </div>;
    }
}

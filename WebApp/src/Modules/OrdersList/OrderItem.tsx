import React from "react";

export default class extends React.Component {
    props: {
        order: Order
    }

    render() {
        return this.props.order.id;
    }
}

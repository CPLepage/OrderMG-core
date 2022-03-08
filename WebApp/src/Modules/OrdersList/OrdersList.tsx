import React from "react";
import OrderStore from "DataStores/OrderStore";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList} from "react-window";
import OrderItem from "Modules/OrdersList/OrderItem";
import {OrderLoading} from "components/OrderLoading";

export default class extends React.Component{

    componentDidMount() {
        OrderStore.getInstance().subscribe(this.forceUpdate.bind(this));
    }

    render() {
        const ordersLoading = OrderLoading();
        if(ordersLoading)
            return ordersLoading;

        const orders = OrderStore.getInstance().getAll();
        return <AutoSizer>{
            ({height, width}) => {
                return <FixedSizeList
                    height={height}
                    width={width}
                    itemCount={orders.length}
                    itemSize={150}
                >
                    {({index, style}) => <div style={{
                        ...style,
                        borderBottom: "1px solid lightgray"
                    }}>
                        <OrderItem order={orders[index]} />
                    </div>}
                </FixedSizeList>
            }
        }</AutoSizer>;
    }
}

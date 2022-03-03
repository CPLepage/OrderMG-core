import React from "react";
import OrderStore from "DataStores/OrderStore";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList} from "react-window";
import OrderItem from "Modules/OrdersList/OrderItem";

export default class extends React.Component{

    componentDidMount() {
        OrderStore.getInstance().subscribe(this.forceUpdate.bind(this));
    }

    render() {
        const orders = OrderStore.getInstance().getAll();

        if(orders === null)
            return "Loading Orders";

        return <AutoSizer>{
            ({height, width}) => {
                return <FixedSizeList
                    height={height}
                    width={width}
                    itemCount={orders.length}
                    itemSize={150}
                >
                    {({index, style}) => <div style={style}>
                        <OrderItem order={OrderStore.instance.getAll()[index]} />
                    </div>}
                </FixedSizeList>
            }
        }</AutoSizer>;
    }
}

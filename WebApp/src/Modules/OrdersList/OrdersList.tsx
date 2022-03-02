import React from "react";
import OrderStore from "DataStores/OrderStore";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList} from "react-window";
import OrderItem from "Modules/OrdersList/OrderItem";

export default class extends React.Component{
    componentDidMount() {
        if(!OrderStore.instance)
            return new OrderStore(this.forceUpdate.bind(this));

        OrderStore.instance.subscribe(this.forceUpdate.bind(this));
    }

    render() {
        if(!OrderStore.instance)
            return "Initializing Orders Store...";

        if(OrderStore.instance.initializing)
            return "Loading Orders...";

        return <AutoSizer>{
            ({height, width}) => {
                return <FixedSizeList
                    height={height}
                    width={width}
                    itemCount={OrderStore.instance.getOrders().length}
                    itemSize={150}
                >
                    {({index, style}) => <div style={style}>
                            <OrderItem order={OrderStore.instance.getOrders()[index]} />
                        </div>
                    }
                </FixedSizeList>
            }
        }</AutoSizer>;
    }
}

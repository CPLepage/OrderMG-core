import React from "react";
import OrderStore from "WebApp/DataStores/OrderStore";
import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList} from "react-window";
import OrderItem from "WebApp/Modules/OrdersList/OrderItem";
import {OrderLoading} from "WebApp/components/OrderLoading";
import Headers from "WebApp/Modules/OrdersList/Headers";
import constants from "Shared/constants";
import CalcListWidth from "WebApp/Modules/OrdersList/CalcListWidth";

export default class extends React.Component{
    readonly HEADER_HEIGHT = 50;

    componentDidMount() {
        OrderStore.getInstance().subscribe(this.forceUpdate.bind(this));
    }

    renderListOrLoading(){
        const ordersLoading = OrderLoading();
        if(ordersLoading)
            return ordersLoading;

        const orders = OrderStore.getInstance().getAll();

        return <div style={{height: `calc(100% - ${this.HEADER_HEIGHT}px)`, width: CalcListWidth()}}>
                <AutoSizer>{({height, width}) => {
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
                </FixedSizeList>}}
            </AutoSizer>
        </div>
    }

    render() {
        return <div style={{height: "100%", width: "100%"}}>
            <div style={{height: this.HEADER_HEIGHT, width: "100%"}}>
                <Headers columns={constants.defaultColumns} />
            </div>
            {this.renderListOrLoading()}
        </div>;
    }
}

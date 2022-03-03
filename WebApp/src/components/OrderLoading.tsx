import OrderStore from "DataStores/OrderStore";
import React, {CSSProperties} from "react";
import ProgressBar from "components/ProgressBar";

const wrapperStyle: CSSProperties =  {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
}

export function OrderLoading(){
    const orderStore = OrderStore.getInstance();

    if(!orderStore.loaded) {
        orderStore.load();
        return <div style={wrapperStyle}>Loading Orders...</div>;
    }

    if(orderStore.loading) {
        return <div style={wrapperStyle}>
            <div>Loading Orders</div>
            <ProgressBar progress={orderStore.getAll().length / orderStore.count} />
            <small>{orderStore.getAll().length + "/" + orderStore.count}</small>
        </div>
    }

    return null;
}

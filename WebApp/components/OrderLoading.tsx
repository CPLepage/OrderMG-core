import OrderStore from "WebApp/DataStores/OrderStore";
import React, {CSSProperties} from "react";
import ProgressBar from "WebApp/components/ProgressBar";
import {t} from "i18next";

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
        return <div style={wrapperStyle}>{t("Loading Orders")}...</div>;
    }

    if(orderStore.loading) {
        return <div style={wrapperStyle}>
            <div>{t("Loading Orders")}</div>
            <ProgressBar progress={orderStore.getAll().length / orderStore.count} />
            <small>{orderStore.getAll().length + "/" + orderStore.count}</small>
        </div>
    }

    if(orderStore.loaded && orderStore.count === 0)
        return <div style={wrapperStyle}>{t("No order found")} :(</div>

    return null;
}

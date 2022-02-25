import React from "react";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import ViewLoaderAsync from "ViewRouter/ViewLoaderAsync";

const views = [
    {
        slug: "/",
        name: "Full",
        component: async () => (await import("Views/Full")).default,
    },
    {
        slug: "/lite",
        name: "Lite",
        component: async () => (await import("Views/Lite")).default,
    }
];

export default function (){
    return (
        <BrowserRouter>
            { views.map((item, index) => <NavLink
                to={item.slug}
                key={"link-" + index}
            >{item.name}</NavLink>)}
            <Routes>
                { views.map((item, index) => <Route
                    path={item.slug}
                    key={"view-" + index}
                    element={<ViewLoaderAsync component={item.component} />} /> ) }
            </Routes>
        </BrowserRouter>
    )
};

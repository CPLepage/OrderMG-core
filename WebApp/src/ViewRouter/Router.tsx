import React from "react";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import ViewLoaderAsync from "ViewRouter/ViewLoaderAsync";
import NavBar from "ViewRouter/NavBar";

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
    const navBarHeight = 50;

    let activeViewIndex = 0;
    views.forEach((view, index) => {
        if(view.slug === window.location.pathname)
            activeViewIndex = index;
    });

    return (
        <BrowserRouter>
            <NavBar height={navBarHeight} defaultActiveViewIndex={activeViewIndex}>
                { views.map((item, index) => <NavLink
                    style={{color: "currentColor"}}
                    to={item.slug}
                    key={"link-" + index}>{item.name}</NavLink>)}
            </NavBar>
            <div style={{height: `calc(100% - ${navBarHeight}px)`, width: "100%"}}>
                <Routes>
                    { views.map((item, index) => <Route
                        path={item.slug}
                        key={"view-" + index}
                        element={<ViewLoaderAsync component={item.component} />} /> ) }
                </Routes>
            </div>
        </BrowserRouter>
    )
};

import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = function (props) {
    if (localStorage.getItem('token')) {
        return <Route path={props.path} component={props.component} />
    }  else {
        return <Redirect to='/' />
    }
}

export default PrivateRoute;
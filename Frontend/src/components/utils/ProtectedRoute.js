import React, { useContext, useEffect } from "react";
import { GlobalContext } from '../../App';
import { Redirect, Route } from "react-router-dom";
import { toast } from "../../hooks/notification";

function ProtectedRoute({ component: Component, ...props }) {

    const { user } = useContext(GlobalContext);
    const isAuthenticated = Boolean(user.username)

    useEffect(() => {
        if (!isAuthenticated) {
            toast.notify({ message: "Please login or Signup", type: 'error' })
        }
    }, [isAuthenticated])


    return (
        <Route
            {...props}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/user?screen=login" />
            }
        />
    );
}

export default ProtectedRoute;
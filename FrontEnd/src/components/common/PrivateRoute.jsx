import React, { useEffect, useContext, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AccessTokenContext } from '../../accessTokenContext';
import authService from '../../services/auth.service.js';
function PrivateRoute({ component: Component, ...rest }) {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    useEffect(async () => {
        const response = await authService.verifyAccessToken(accessToken, setAccessToken);
        if (response.status === 200)
            setIsAuthenticated(true);
        else
            setIsAuthenticated(false);
    }, []);
    return (
        <Route {...rest} render={({ location }) => {
            return isAuthenticated === true
                ? <Component isAuthenticated />
                : <Redirect to={{ pathname: '/', state: { from: location } }} />
        }} />
    )
}

export default PrivateRoute;
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from './auth-service';

/**
* This class returns an AuthWrapped componented.
*/
export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    /**
    * Main rendering loop
    */
    return class AuthWrapped extends Component {

        render() {
            // Second part of this if statement is a weak solution to applying this function to modals.
            if (Auth.loggedIn() || this.props.show === false) {
                return (
                    <AuthComponent {...this.props} />
                );
            }
            else {
                return (<Redirect to={{
                    pathname:'/login',
                    state: { redirect: this.props.returnRedirect }
                    }} />);
            }
        }
    };
}

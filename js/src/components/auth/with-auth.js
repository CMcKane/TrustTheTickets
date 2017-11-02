import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from './auth-service';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    return class AuthWrapped extends Component {

        render() {
            if (Auth.loggedIn()) {
                return (
                    <AuthComponent {...this.props} />
                );
            }
            else {
                return (<Redirect to='/login' />);
            }
        }
    };
}

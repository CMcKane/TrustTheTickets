import React, {Component} from 'react';
import NotFoundView from './components/global/not-found-view';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import Login from './components/auth/login';
import Registration from './components/registration/registration';
import Home from './components/home/home'
import Header from './components/global/header'
import MyAccount from './components/auth/my-account';
import PickTickets from './components/pick-tickets/pick-tickets';
import EventCalendarView from './components/events/event-calendar-view';
import Versus from './components/versus/versus';
import AuthService from './components/auth/auth-service';
import CheckoutLanding from './components/pick-tickets/checkout-landing';
import CreateListingSubmitLanding from "./components/account/listings/create-listing-submit-landing";
import './stylesheet.css';

const navItems = [
    {
        label: 'Calendar',
        url: '/event-calendar?m=' + new Date().getMonth() + '&y=' + new Date().getFullYear()
    },
    {
        label: 'Teams',
        url: '/versus'
    },
    {
        label: 'My Account',
        url: '/my-account'
     }
 ];

export default class App extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            navItems,
            token: this.Auth.getToken()
        };

        this.Auth.refreshToken()
            .then(res => {
                if (res.data.authenticated) {
                    this.setState({
                        token: res.data.token
                    });
                }
            });
    }

    userLogIn(token) {
        this.setState({
            token: token
        });
    }

    userLogOut() {
        this.setState({
            token: null
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Header navItems={this.state.navItems}/>
                    <div className="appContent">
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/event-calendar' component={EventCalendarView}/>
                        <Route path='/pick-tickets' component={PickTickets}/>
                        <Route path='/versus' component={Versus}/>
                        <Route path='/checkout-landing' component={CheckoutLanding}/>
                        <Route path='/create-listing-submit-landing' component={CreateListingSubmitLanding}/>
                        <Route exact path='/my-account' render={(props) =>
                            <MyAccount
                                {...props} logIn={this.userLogIn.bind(this)}
                                logOut={this.userLogOut.bind(this)}
                            />}
                        />
                        <Route path='/login' render={(props) =>
                            <Login
                                {...props}
                                logIn={this.userLogIn.bind(this)}
                            />}
                        />
                        <Route path='/register' render={(props) =>
                            <Registration
                                {...props}
                            />}
                        />
                        <Route path="/404" component={NotFoundView}/>
                        <Route component={NotFoundView}/>
                    </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}
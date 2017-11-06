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

import {login, logout, initializeUser} from './components/auth/user';
import PickTickets from './components/pick-tickets/pick-tickets';
import ViewTickets from './components/pick-tickets/view-tickets';
import EventCalendarView from './components/events/event-calendar-view';
import EventListView from './components/events/event-list-view';
import './App.css';

const navItems = [
    {
        label: 'Calendar',
        url: '/event-calendar?m=' + new Date().getMonth() + '&y=' + new Date().getFullYear()
    },
    {
        label: 'Teams',
        url: '/event-list'
    },
    {
        label: 'My Account',
        url: '/my-account'
    }
]


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navItems,
            user: initializeUser()
        };
    }

    userLogIn(emailAddress, fname, lname) {
        this.setState({
            user: login(emailAddress, fname, lname)
        });
    }

    userLogOut() {
        this.setState({
            user: logout()
        })
    }

    render() {
        return (
            <Router>
                <div>
                    <Header navItems={this.state.navItems}/>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/view-tickets' component={ViewTickets}/>
                        <Route path='/event-calendar' component={EventCalendarView}/>
                        <Route path='/event-list' component={EventListView}/>
                        <Route path='/pick-tickets' component={PickTickets}/>
                        <Route path='/my-account' render={(props) =>
                            <MyAccount
                                {...props}
                                logIn={this.userLogIn.bind(this)}
                                logOut={this.userLogOut.bind(this)}
                                user={this.state.user}
                            />}
                        />
                        <Route path='/login' render={(props) =>
                            <Login
                                {...props}
                                logIn={this.userLogIn.bind(this)}
                                userLoggedIn={this.state.user.loggedIn}
                            />}
                        />
                        <Route path='/register' render={(props) =>
                            <Registration
                                {...props}
                                userLoggedIn={this.state.user.loggedIn}
                            />}
                        />
                        <Route path='/about'/>
                        <Route path="/not-found" component={NotFoundView}/>
                        <Route component={NotFoundView}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

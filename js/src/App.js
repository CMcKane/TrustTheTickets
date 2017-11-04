import React, { Component } from 'react';
import Header from './components/global/header';
import NotFoundView from './components/global/not-found-view';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';

import Login from './components/auth/login';
import Registration from './components/registration/registration';
import Home from './components/home/home';
import Home2 from './components/home/home2'
import MyAccount from './components/auth/my-account';

import { login, logout, initializeUser } from './components/auth/user';
import PickTickets from './components/pick-tickets/pick-tickets';
import ViewTickets from './components/pick-tickets/view-tickets';
import EventCalendarView from './components/events/event-calendar-view';
import EventListView from './components/events/event-list-view';
import './App.css';

const navItems = [
    // {
    //     label: 'Pick Tickets',
    //     url: '/pick-tickets'
    // },
    {
        label: 'Home2',
        url: '/2'
    },
    {
        label: 'My Account',
        url: '/my-account'
    }//,
    // {
    //   label: 'Event Calendar',
    //   url: '/event-calendar?m=' + new Date().getMonth() + '&y=' + new Date().getFullYear()
    // },
    // {
    //   label: 'Event List',
    //   url: '/event-list'
    // }
];

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          navItems,
          user: initializeUser(),
          onSecondaryHome: false
      };
  }

  sectionSelected(section) {
    this.setState({selectedSection: section});
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

  updateSecondHome(value){
      this.setState({ onSecondaryHome: value});
  }

  render() {
    return (
        <Router>
            <div>
                {!this.state.onSecondaryHome &&
                    <Header navItems={this.state.navItems} />
                }
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/2' render={(props) =>
                        <Home2
                            {...props}
                            updateSecondHome={this.updateSecondHome.bind(this)}
                        />}
                    />
                    <Route path='/view-tickets' component={ViewTickets} />
                    <Route path='/event-calendar' component={EventCalendarView} />
                    <Route path='/event-list' component={EventListView} />
                    <Route path='/pick-tickets' component={PickTickets} />
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
                    <Route path='/about' />
                    <Route path="/not-found" component={NotFoundView}/>
                    <Route component={NotFoundView} />
                </Switch>
            </div>
        </Router>
    );
  }
}

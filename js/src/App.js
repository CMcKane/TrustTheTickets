import React, { Component } from 'react';
import Header from './components/global/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';

import Login from './components/auth/login';
import ViewAccounts from './components/accounts/view-accounts';
import Registration from './components/auth/registration';
import Home from './components/home/home';
import MyAccount from './components/auth/my-account';

import { login, logout, initializeUser } from './components/auth/user';
import PickTickets from './components/pick-tickets/pick-tickets';
import ViewTickets from './components/pick-tickets/view-tickets';

const navItems = [
    {
        label: 'Pick Tickets',
        url: '/pick-tickets'
    },
    {
        label: 'Registered Accounts',
        url: '/view-accounts'
    },
    {
        label: 'My Account',
        url: '/my-account'
    }
];

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          navItems,
          user: initializeUser()
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

  render() {
    return (
      <Router>
        <div className="App">
          <Header navItems={this.state.navItems} />
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/view-accounts' component={ViewAccounts} />
              <Route path='/view-tickets' component={ViewTickets} />
              <Route path='/pick-tickets' component={PickTickets} />
              <Route path='/my-account' render={(props) =>
                  <MyAccount
                      {...props} logIn={this.userLogIn.bind(this)}
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
          </Switch>
        </div>
      </Router>
    );
  }
}

import React, { Component } from 'react';
import Header from './components/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';

import WellsFargoChart from './components/wells-fargo-chart';
import Login from './components/auth/login';
import ViewAccounts from './components/buy/view-accounts';
import Registration from './components/auth/registration';
<<<<<<< HEAD
// import ChooseGame from './components/buy/choose-game';
import MyAccount from './components/auth/my-account'
import Home from './components/home';
=======
import ChooseGame from './components/buy/choose-game';
import MyAccount from './components/auth/my-account';
import {login, logout, initializeUser} from './components/auth/user';
>>>>>>> e1505740c48fb7351e4ca2bff338e1f96a8bf462

const navItems = [
{
    label: 'Registered Accounts',
    url: '/view-accounts'
},
{
    label: 'My Account',
    url: '/my-account'
},
/*
{
    label: 'Choose Game',
    url: '/choose-game'
},
{
    label: 'About Us',
    url: '/about'
}
*/
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

  userLogIn(emailAddress) {
    this.setState({
      user: login(emailAddress)
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
              {/*
            <Route path='/sell'  />
            <Route path='/choose-game' component={ChooseGame} />
            */
              }
            <Route path='/my-account'
              render={(props) => <MyAccount {...props} 
              logIn={this.userLogIn.bind(this)} 
              logOut={this.userLogOut.bind(this)} 
              user={this.state.user} />} />
            <Route path='/login'
              render={(props) => <Login {...props} 
              logIn={this.userLogIn.bind(this)} 
              userLoggedIn={this.state.user.loggedIn}/>} />
            <Route path='/register'
              render={(props) => <Registration {...props} 
              userLoggedIn={this.state.user.loggedIn}/>} />
            <Route path='/about' />                     
          </Switch>
        </div>
      </Router>
    );
  }
}

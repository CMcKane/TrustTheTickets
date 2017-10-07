import React, { Component } from 'react';
import Header from './components/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';
import WellsFargoChart from './components/wells-fargo-chart';
import Login from './components/auth/login';
import Buy from './components/buy/buy';
import Registration from './components/auth/registration';
import ChooseGame from './components/buy/choose-game';
import MyAccount from './components/auth/my-account';

const navItems = [
{
    label: 'Buy',
    url: '/buy'
},
{
    label: 'Sell',
    url: '/sell'
},
{
    label: 'Choose Game',
    url: '/choose-game'
},
{
  label: 'My Account',
  url: '/myaccount'
},
{
    label: 'About Us',
    url: '/about'
}
];

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          navItems,
          userLoggedIn: false,
          email: ''
      };
  }

  sectionSelected(section) {
    this.setState({selectedSection: section});
  }

  userLogIn(emailAddress) {
    this.setState({
      userLoggedIn: true,
      email: emailAddress
    });
  }

  userLogOut() {
    this.setState({
      userLoggedIn: false,
      email: ''
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header navItems={this.state.navItems} />
          <Switch>
            <Route exact path='/' component={WellsFargoChart} />
            <Route path='/buy' component={Buy} />
            <Route path='/sell'  />
            <Route path='/choose-game' component={ChooseGame} />
            <Route path='/myaccount'
              render={(props) => <MyAccount {...props} 
              logIn={this.userLogIn.bind(this)} 
              logOut={this.userLogOut.bind(this)} 
              userLoggedIn={this.state.userLoggedIn} 
              email={this.state.email} />} />
            <Route path='/login'
              render={(props) => <Login {...props} 
              logIn={this.userLogIn.bind(this)} 
              userLoggedIn={this.state.userLoggedIn}/>} />
            <Route path='/register'
              render={(props) => <Registration {...props} 
              userLoggedIn={this.state.userLoggedIn}/>} />
            <Route path='/about' />                     
          </Switch>
        </div>
      </Router>
    );
  }
}

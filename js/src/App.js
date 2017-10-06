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
import Registration from './components/login/registration';
import ChooseGame from './components/buy/choose-game';

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
    label: 'Log In',
    url: '/login'
},
{
    label: 'About Us',
    url: '/about'
},
{
  label: 'Register',
  url: '/register'
}
];

export default class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          navItems
      };
  }

  sectionSelected(section) {
    this.setState({selectedSection: section});
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
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Registration}/>
            <Route path='/about' />                     
          </Switch>
        </div>
      </Router>
    );
  }
}

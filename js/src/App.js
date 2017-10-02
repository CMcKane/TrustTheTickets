import React, { Component } from 'react';
import Header from './components/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';
import WellsFargoChart from './components/wells-fargo-chart';
import Login from './components/login/login';

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
    label: 'Log In',
    url: '/login'
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
            <Route path='/buy' />
            <Route path='/sell'  />
            <Route path='/login' component={Login}/>
            <Route path='/about' />                     
          </Switch>
        </div>
      </Router>
    );
  }
}

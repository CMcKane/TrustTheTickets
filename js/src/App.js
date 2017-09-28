import React, { Component } from 'react';
import Header from './components/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';

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

  render() {
    return (
      <Router>
        <div className="App">
          <Header navItems={this.state.navItems} />
          <Switch>
            <Route exact path='/' />
            <Route path='/buy' />
            <Route path='/sell'  />
            <Route path='/login' />
            <Route path='/about' />
            <Route path='/test' />                        
          </Switch>
        </div>
      </Router>
    );
  }
}

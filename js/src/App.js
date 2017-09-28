import React, { Component } from 'react';
import Header from './components/header';
import { 
    BrowserRouter as Router, 
    Route,
    Switch
} from 'react-router-dom';
import WellsFargoChart from './components/wells-fargo-chart';

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
          navItems,
          text: 'Select a section'
      };
  }

  sectionSelected(section) {
    this.setState({text: section});
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
          </Switch>
          <div>
            <p>{this.state.text}</p>
          </div>
          <div>
          <WellsFargoChart onSelected={this.sectionSelected.bind(this)}/>
          </div>
        </div>
      </Router>
    );
  }
}

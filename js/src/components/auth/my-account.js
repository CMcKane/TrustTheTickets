import React, {Component} from 'react';
import {Button, Tabs, Tab} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import withAuth from './with-auth';
import AuthService from './auth-service';
import ListingsView from '../account/listings/listings-view';
import CreateListingView from '../account/listings/create-listing-view';
import PurchasesView from '../account/listings/purchases-view';

const purchases = [
{
    homeTeam: '76ers',
    awayTeam: 'Heat',
    date: '11/15/2017',
    price: 120,
    transactionDate: '11/04/2017',
    transactionTotal: 524,
    chargesTotal: 48,
    rate: 0.1,
    section: '101',
    row: '18',
    seats: [1,2,3,4]
},
{
    homeTeam: '76ers',
    awayTeam: 'Warriors',
    price: 200,
    date: '10/20/2017',
    transactionDate: '10/01/2017',
    transactionTotal: 880,
    chargesTotal: 80,
    rate: 0.1,
    section: '116',
    row: '1',
    seats: [5,6,7,8]
},
{
    homeTeam: '76ers',
    awayTeam: 'Cavaliers',
    price: 150,
    date: '11/01/2017',
    transactionDate: '09/13/2017',
    transactionTotal: 330,
    chargesTotal: 30,
    rate: 0.1,
    section: '221',
    row: '7',
    seats: [21,22]
}
]

class MyAccount extends Component {

    constructor(props) {
      super(props);
      this.Auth = new AuthService();
      this.state = {
        firstName: '',
        lastName: ''
      }
    }

    logOut() {
        this.Auth.logOut();
        this.props.logOut();
    }

    componentDidMount() {
        TTTPost("/my-account", {
            token: this.Auth.getToken()
        })
        .then(res => {
            if (res.data.authenticated)
            {
                this.setState({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    populated: true
                });
            }
        });
    }

    getAccountInfo() {
        if (this.state.populated) return (<h1>Welcome {this.state.firstName} {this.state.lastName}</h1>)
    }

    render() {
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                            <Tab eventKey={1} title="Account Settings">
                                <div className="globalCenterThis">
                                    {this.getAccountInfo()}
                                    <div className="globalCenterThis">
                                    <Button bsStyle='primary'
                                            onClick={this.logOut.bind(this)}>
                                        Log Out
                                    </Button>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey={2} title="My Listings">
                                <div>
                                    <ListingsView/>
                                </div>
                            </Tab>
                            <Tab eventKey={3} title="Create A Listing">
                                <div>
                                   <CreateListingView/>
                                </div>
                            </Tab>
                            <Tab eventKey={4} title="My Purchase History">
                                <div>
                                   <PurchasesView purchases={purchases} />
                                </div>
                            </Tab>
                        </Tabs>
                </div>
            </div>
        );
    }
}

export default withAuth(MyAccount);

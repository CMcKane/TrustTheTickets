import React, {Component} from 'react';
import {Button, Tabs, Tab} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import withAuth from './with-auth';
import AuthService from './auth-service';
import ListingsView from '../account/listings/listings-view';
import CreateListingView from '../account/listings/create-listing-view';
import PurchasesView from '../account/listings/purchases-view';

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
                                   <PurchasesView />
                                </div>
                            </Tab>
                        </Tabs>
                </div>
            </div>
        );
    }
}

export default withAuth(MyAccount);

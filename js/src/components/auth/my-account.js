import React, {Component} from 'react';
import {Button, Tabs, Tab} from 'react-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import withAuth from './with-auth';
import AuthService from './auth-service';
import ListingsView from '../account/listings/listings-view';
import CreateListingView from '../account/listings/create-listing-view';
import PurchasesView from '../account/listings/purchases-view';
import { Grid, Row } from 'react-bootstrap';

/**
* This is the my account web page class.
*/
class MyAccount extends Component {

    /**
    * Constructor.
    */
    constructor(props) {
      super(props);
      this.Auth = new AuthService();
      this.state = {
        firstName: '',
        lastName: ''
      }
    }

    /**
    * Handle when the user logs out of their account.
    */
    logOut() {
        this.Auth.logOut();
        this.props.logOut();
    }

    /**
    * Triggered on page load.
    */
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

    /**
    * Gets the information for the users account.
    */
    getAccountInfo() {
        if (this.state.populated) return (<h1>Welcome {this.state.firstName} {this.state.lastName}</h1>)
    }

    /**
    * Main rendering loop.
    */
    render() {
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                            <Tab eventKey={1} title="Account Settings">
                                <Grid>
                                <Row>
                                    <div className="globalCenterThis">
                                        {this.getAccountInfo()}
                                    </div>
                                </Row>
                                <Row>
                                    <div className="globalCenterThis">
                                    <Button bsStyle='primary'
                                            onClick={this.logOut.bind(this)}>
                                        Log Out
                                    </Button>
                                    </div>
                                </Row>
                                </Grid>
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

import React, { Component }  from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default class MyAccount extends Component {

    render() {
        if (this.props.user.loggedIn) {
            return (
                <div className='text-center'>
                    <h1>My Account</h1>
                    <h3>Welcome {this.props.user.fname} {this.props.user.lname}!</h3>
                        <Button bsStyle='primary'
                        onClick={this.props.logOut.bind(this)}>
                        Log Out
                    </Button>
                </div>
            );
        }
        return <Redirect to='/login' />
    }
}

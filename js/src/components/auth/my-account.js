import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import '../../App.css';

export default class MyAccount extends Component {

    render() {
        if (this.props.user.loggedIn) {
            return (
                <div className='homeBody'>
                    <div className='text-center' style={{color: 'white', paddingTop: '5%'}}>
                        <h1>My Account</h1>
                        <h3>Welcome {this.props.user.fname} {this.props.user.lname}!</h3>
                        <Button bsStyle='primary'
                                onClick={this.props.logOut.bind(this)}>
                            Log Out
                        </Button>
                    </div>
                </div>
            );
        }
        return <Redirect to='/login'/>
    }
}

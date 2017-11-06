import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import withAuth from './with-auth';
import AuthService from './auth-service';

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
        if (this.state.populated) return (<h3>Welcome {this.state.firstName} {this.state.lastName}</h3>)
    }

    render() {
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                    <div className='globalPageTitle'>
                        <h1>My Account</h1>
                        {this.getAccountInfo()}
                        <Button bsStyle='primary'
                                onClick={this.logOut.bind(this)}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth(MyAccount);
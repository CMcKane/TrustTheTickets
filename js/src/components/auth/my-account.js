import React, { Component }  from 'react';
import { Button } from 'react-bootstrap';

export default class MyAccount extends Component {

    render() {
        if (this.props.userLoggedIn) {
            return (
                <div>
                    My Account Homepage
                <Button bsStyle="primary"
                    onClick={this.props.logOut.bind(this)}>
                    Log Out
                </Button>
                </div>
            );
        }
        this.props.history.push('/login')
        return '';
    }
}

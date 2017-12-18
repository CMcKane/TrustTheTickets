import React, {Component} from 'react';
import queryString from 'query-string';
import {TTTPost} from '../backend/ttt-request';
import {Redirect} from 'react-router-dom';
import RegistrationEmail from './registration-email';
import RegistrationConfirmation from './registration-confirmation';
import RegistrationRedirect from './registration-redirect';
import RegistrationView from './registration-view';

/**
* This component is used to represent the account registration web page.
*/
export default class Registration extends Component {

    /**
    * Constructor
    */
    constructor(props) {
        super(props);

        this.state = {
            inProgress: false,
            completed: false
        };
    }

    /**
    * Set registration in progress.
    * @param val - the value to set inProgress with.
    */
    setInProgress(val) {
        this.setState({inProgress: val});
    }

    /**
    * Call to the backend to confirm the account registration.
    */
    validateRegistrationId(registrationID) {
        TTTPost("/registration-confirm", {
            registrationID: registrationID
        })
            .then(res => {
                if (res.data.errorMessage) {
                    alert(res.data.errorMessage);
                }
                else {
                    this.setState({completed: true});
                }
            });
    }

    /**
    * Render method to render the web page.
    */
    render() {
        if (this.props.userLoggedIn) {
            return <Redirect to='/my-account'/>
        }
        const queryParams = queryString.parse(this.props.location.search)
        // If registration process is complete
        if (this.state.completed) {
            return <RegistrationConfirmation />;
        }
        else if (queryParams.registrationID) {
            // Validate the query params by making request to backend
            this.validateRegistrationId(queryParams.registrationID);
            return <RegistrationRedirect />;
        }
        // If waiting on email confirmation!
        else if (this.state.inProgress) {
            return <RegistrationEmail />;
        }
        // If no other conditions are met then we're in the initial state
        else return (
                <RegistrationView setInProgress={this.setInProgress.bind(this)} />
            );
    }
}

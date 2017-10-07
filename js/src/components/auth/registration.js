import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';
import queryString from 'query-string';

export default class Registration extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          secondPassword: '',
          inProgress: false,
          completed: false
      };
    }

    getValidationState() {
        const length = this.state.password.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    getSecondPasswordValidationState() {
        const length = this.state.secondPassword.length;
        if (length > 7 && this.state.password === this.state.secondPassword)
            return 'success';
        else if (length > 5 && this.state.password === this.state.secondPassword) 
            return 'warning';
        else if (length > 0 ) return 'error';
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        if (this.getValidationState() === 'error') {
            this.alertRegistrationError('Password not long enough.');
        } else if (this.getSecondPasswordValidationState() === 'error') {
            this.alertRegistrationError('Passwords do not match.');
        } else {
            axios.post("http://127.0.0.1:5000/register", {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                if(res.data.errorMessage) {
                    alert(res.data.errorMessage);
                }
                this.setState({ inProgress: res.data.registrationStatus });
            });
        }
    }

    // Eventually change to a popup modal
    alertRegistrationError(message) {
        alert(message);
    }

    validateRegistrationId(registrationID) {
            axios.post("http://127.0.0.1:5000/registration-confirm", {
                registrationID: registrationID
            })
            .then(res => {
                if(res.data.errorMessage) {
                    alert(res.data.errorMessage);
                }
                this.setState({completed: true});
            });
    }

    registrationSuccess() {
        return (
            "Registration was a success!"
        );
    }

    emailConfirmation() {
        return (
            "You've been sent a confirmation email."
        );
    }

    render() {

        if (this.props.userLoggedIn) {
            this.props.history.push('/myaccount');
            return '';
        }
        const queryParams = queryString.parse(this.props.location.search)
        // If registration process is complete
        if (this.state.completed) {
            return "Registration complete!";
        } 
        else if (queryParams.registrationID) {
            // Validate the query params by making request to backend
            this.validateRegistrationId(queryParams.registrationID);
            return '';
        } 
        // If waiting on email confirmation!
        else if (this.state.inProgress) {
            return this.emailConfirmation();
        }
        // If no other conditions are met then we're in the initial state
        else return (
            <form>
                <FormGroup controlId="formControlsEmail">
                    <ControlLabel>Email address</ControlLabel>
                    <FormControl placeholder="Enter email" type="email"
                        value={this.state.email}
                        name="email"
                        onChange={this.handleChange.bind(this)}  />
                </FormGroup>
                <FormGroup 
                    controlId="formControlsPassword" 
                    validationState={this.getValidationState()}>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl type="password" 
                        value={this.state.password}
                        name="password"
                        onChange={this.handleChange.bind(this)} />
                </FormGroup>
                <FormGroup 
                    controlId="formControlsPassword" 
                    validationState={this.getSecondPasswordValidationState()}>
                    <ControlLabel>Re-enter Password</ControlLabel>
                    <FormControl type="password" 
                        value={this.state.secondPassword}
                        name="secondPassword"
                        onChange={this.handleChange.bind(this)} />
                </FormGroup>
                <Button bsStyle="primary"
                    onClick={this.onSubmit.bind(this)}>
                    Register
                </Button>
            </form>
        );
    }
}

import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';

export default class Registration extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          secondPassword: '',
          registrationStatus: false
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
        if (length > 10 && this.state.password === this.state.secondPassword)
            return 'success';
        else if (length > 5 && this.state.password === this.state.secondPassword) 
            return 'warning';
        else if (length > 0 ) return 'error';
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        if (this.getValidationState() !== 'error' 
            && this.getSecondPasswordValidationState() !== 'error') {
            axios.post("http://127.0.0.1:5000/register", {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                console.log(res)
                if(res.data.errorMessage) {
                    alert(res.data.errorMessage);
                }
                this.setState({ registrationStatus: res.data.registrationStatus });
            });
        }
    }

    render() {
        if (this.state.registrationStatus) {
            return (
                'Registration complete!'
                // Just placeholder
            );
        }
        return (
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

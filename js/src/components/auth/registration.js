import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

export default class Registration extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
      };
    }

    getValidationState() {
        const length = this.state.password.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    handleChange(e) {
        this.setState({ e.target.name: e.target.value });
    }

    render() {
        return (
            <form>
                <FormGroup controlId="formControlsEmail">
                    <ControlLabel>Email address</ControlLabel>
                    <FormControl placeholder="Enter email" type="email"
                        value={this.state.email}
                        onChange={this.handleChange.bind(this)}  />
                </FormGroup>
                <FormGroup 
                    controlId="formControlsPassword" 
                    validationState={this.getValidationState()}>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl type="password" 
                        value={this.state.password}
                        onChange={this.handleChange.bind(this)} />
                </FormGroup>
            </form>
        );
    }
}

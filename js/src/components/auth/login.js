import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Login extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: ''
      };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        axios.post("http://127.0.0.1:5000/login", {
            email: this.state.email,
            password: this.state.password
        })
        .then(res => {
            if(!res.data.authenticated) {
                alert(res.data.errorMessage);
            }
            else {
                this.props.logIn(this.state.email);
            }
        });
    }

    render() {
        if (this.props.userLoggedIn) {
            this.props.history.push('/myaccount');
            return '';
        }
        return (
            <div>
            <h1>Log In</h1>
            <form>
                <FormGroup controlId="formControlsEmail">
                    <ControlLabel>Email address</ControlLabel>
                    <FormControl placeholder="Enter email" type="email"
                        value={this.state.email}
                        name="email"
                        onChange={this.handleChange.bind(this)}  />
                </FormGroup>
                <FormGroup 
                    controlId="formControlsPassword" >
                    <ControlLabel>Password</ControlLabel>
                    <FormControl type="password" 
                        value={this.state.password}
                        name="password"
                        onChange={this.handleChange.bind(this)} />
                </FormGroup>
                <Button bsStyle="primary"
                    onClick={this.onSubmit.bind(this)}>
                    Log In
                </Button>
            </form>
            Don't have an account?  
            <Link to='/register'> Register here.</Link>
            </div>
        );
    }
}

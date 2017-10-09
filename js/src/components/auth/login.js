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
        var success = false;
        axios.post("http://127.0.0.1:5000/login", {
            email: this.state.email,
            password: this.state.password
        })
        .then(res => {
            if(!res.data.authenticated) {
                alert(res.data.errorMessage);
                success = true;
            }
            else {
                this.props.logIn(this.state.email);
            }
        });
        if (!success) {
            this.renderWrongEmailPassword();
        }
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
                    <ControlLabel id="EmailAddress">Email address</ControlLabel>
                    <div id="WrongEmailPassword"> </div>
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

    renderWrongEmailPassword() {
        var div = document.getElementById("EmailAddress");
        var text = "The email and/or password are incorrect";
        div.style.color = "Red";
        div.innerText = text;
    }
}

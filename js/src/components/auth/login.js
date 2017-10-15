import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TTTPost } from '../backend/ttt-request';
import './login.css';

export default class Login extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          fname: '',
          lname: ''
      };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        TTTPost("/login", {
            email: this.state.email,
            password: this.state.password
        })
        .then(res => {
            if (!res.data.authenticated)
            {
                this.renderWrongEmailPassword();
            }
            else
            {
                this.setState({
                    fname: res.data.fname,
                    lname: res.data.lname
                })

                this.props.logIn(
                    this.state.email,
                    this.state.fname,
                    this.state.lname);
            }
        });
    }

    render() {
        if (this.props.userLoggedIn) {
            this.props.history.push('/my-account');
            return '';
        }
        return (
            <div className="centered">
                <h1 className="text-center">Log In</h1>
                <form>
                    <FormGroup controlId="formControlsEmail">
                        <ControlLabel id="EmailAddress">Email address</ControlLabel>
                        <div id="WrongEmailPassword"> </div>
                        <FormControl style={{width: 350}} placeholder="Enter email" type="email"
                            value={this.state.email}
                            name="email"
                            onChange={this.handleChange.bind(this)}  />
                    </FormGroup>
                    <FormGroup controlId="formControlsPassword" >
                        <ControlLabel>Password</ControlLabel>
                        <FormControl style={{width: 350}} placeholder="Password" type="password"
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
        var div = document.getElementById("WrongEmailPassword");
        var text = "The email and/or password are incorrect";
        div.style.color = "Red";
        div.innerText = text;
    }
}

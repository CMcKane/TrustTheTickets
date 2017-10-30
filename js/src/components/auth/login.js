import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { TTTPost } from '../backend/ttt-request';
import './login.css';

export default class Login extends Component {

    constructor(props) {
      super(props);

      this.state = {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          address: null,
          city: null,
          stateprovid: null,
          zipCode: null,
          countryid: null,
          phoneNumber: null
      };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        TTTPost("/login", {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            city: this.state.city,
            stateprovid: this.state.stateprovid,
            zipCode: this.state.zipCode,
            countryid: this.state.countryid,
            phoneNumber: this.state.phoneNumber
        })
        .then(res => {
            if (!res.data.authenticated)
            {
                this.renderWrongEmailPassword();
            }
            else
            {
                this.setState({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName
                })

                this.props.logIn(
                    this.state.email,
                    this.state.firstName,
                    this.state.lastName);
            }
        });
    }

    render() {
        if (this.props.userLoggedIn) {
            return <Redirect to='/my-account' />
        }
        return (
            <div className="centered" style={{paddingTop: "75px"}}>
                <h1 className="text-center" style={{color: 'black'}}>Log In</h1>
                <form>
                    <FormGroup controlId="formControlsEmail">
                        <ControlLabel id="EmailAddress" style={{color: 'black'}}>Email address</ControlLabel>
                        <div id="WrongEmailPassword"> </div>
                        <FormControl style={{width: 350}} placeholder="Enter email" type="email"
                            value={this.state.email}
                            name="email"
                            onChange={this.handleChange.bind(this)}  />
                    </FormGroup>
                    <FormGroup controlId="formControlsPassword" >
                        <ControlLabel style={{color: 'black'}}>Password</ControlLabel>
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
                <p style={{color: 'black'}}>Don't have an account? <Link to='/register'> Register here.</Link></p>
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

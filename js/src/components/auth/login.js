import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import AuthService from './auth-service';

export default class Login extends Component {

    constructor(props) {
      super(props);
      this.Auth = new AuthService();
      this.state = {
          email: '',
          password: '',
          firstName: null,
          lastName: null
      };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.setState({ prevPath: this.props.location })
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        this.Auth.login(this.state.email, this.state.password)
        .then(res => {
            if (res.data.authenticated) {
                this.props.logIn();
            } else {
                this.renderWrongEmailPassword();
            }
        });
    }

    handleOnKeyPress(e){
        if(e.key === 'Enter'){
            document.getElementById("submitButton").click();
            return false;
        }
    }


    render() {
        var path = '/my-account'
        if (this.Auth.loggedIn()) {
            if (this.props.location.state.redirect) path = this.props.location.state.redirect
            return <Redirect to={path} />
        }
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
                    <div className="loginCentered loginTopPadding">
                        <h1 className="text-center loginHeader1">Log In</h1>
                        <form>
                            <FormGroup>
                                <ControlLabel className='loginControlLabel' id="EmailAddress">Email address</ControlLabel>
                                <div id="WrongEmailPassword"> </div>
                                <FormControl className='loginFormControl' placeholder="Enter email" type="email"
                                    value={this.state.email}
                                    name="email"
                                    onChange={this.handleChange.bind(this)}  />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel className='loginControlLabel'>Password</ControlLabel>
                                <FormControl className='loginFormControl' placeholder="Password" type="password"
                                             value={this.state.password}
                                             name="password"
                                             id="passwordForm"
                                             onChange={this.handleChange.bind(this)}
                                             onKeyPress={this.handleOnKeyPress.bind(this)}
                                />
                            </FormGroup>
                            <Button type="button" bsStyle="primary"
                                onClick={this.onSubmit.bind(this)}
                                id="submitButton">
                                Log In
                            </Button>
                        </form>
                        <p className='loginPara'>Don't have an account? <Link to='/register'> Register here.</Link></p>
                    </div>
                </div>
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

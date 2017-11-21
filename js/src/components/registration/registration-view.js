import React, {Component} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Form, Button, Col, Row, Grid} from 'react-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import '../../stylesheet.css';

function FieldGroup({id, label, help, validationState, ...props}) {
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export default class RegistrationView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: {value: '', validationStatus: null, message: null},
            password: {value: '', validationStatus: null, message: null},
            secondPassword: {value: '', validationStatus: null, message: null},
            firstName: {value: '', validationStatus: null, message: null},
            lastName: {value: '', validationStatus: null, message: null},
            address: {value: '', validationStatus: null, message: null},
            city: {value: '', validationStatus: null, message: null},
            zipCode: {value: '', validationStatus: null, message: null},
            country: {value: 0, validationStatus: null, message: null},
            state: {value: 0, validationStatus: null, message: null},
            phoneNumber: {value: '', validationStatus: false, message: null}
        };
    }

    handleChange(e) {
        const fieldName = e.target.name;
        const value = e.target.value;
        this.setState({
            [fieldName]: {value: value, validationStatus: null, message: null}  
        });
    }

    validateForm() {
        var state = this.state;
        var valid = true;
        // Email
        if (state.email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            state.email.validationStatus = true;
        } else {
            state.email.message = 'Please provide a valid email address';
            state.email.validationStatus = 'error';
            valid = false;
        }
        // Password
        if (state.password.value.length > 5) {
            state.password.validationStatus = 'success';
        } else {
            state.password.message = 'Six or more characters required';
            state.password.validationStatus = 'error';
            valid = false;
        }
        // Second password
        if (state.secondPassword.value.length > 5 && state.password === state.secondPassword) {
            state.secondPassword.validationStatus = 'success';
        }
        else {
            state.secondPassword.message = 'Passwords must match'
            state.secondPassword.validationStatus = 'error';
            valid = false;
        }
        // First name
        if (state.firstName.value.length > 0) {
            state.firstName.validationStatus = 'success';
        } else {
            state.firstName.message = 'Please provide a valid first name'
            state.firstName.validationStatus = 'error';
            valid = false;
        }
        // Last name
        if (state.lastName.value.length > 0) {
            state.lastName.validationStatus = 'success'; 
        } else {
            state.lastName.message = 'Please provide a valid last name'
            state.lastName.validationStatus = 'error';
            valid = false;
        }
        // Address
        if (state.address.value.length > 0) {
            state.address.validationStatus = 'success';  
        } else {
            state.address.message = 'Please provide a valid address'
            state.address.validationStatus = 'error';
            valid = false;
        }
        // City
        if (state.city.value.length > 0) {
            state.city.validationStatus = 'success';
        } else {
            state.city.message = 'Please provide a valid city'
            state.city.validationStatus = 'error';
            valid = false;
        }
        // Zip code 
        if (state.zipCode.value.length > 0 && ~~state.zipCode.value) {
            state.zipCode.validationStatus = 'sucess'; 
        } else {
            state.zipCode.message = 'Please provide a valid zip code'
            state.zipCode.validationStatus = 'error';
            valid = false;
        }
        // Phone number 
        if (state.phoneNumber.value.length > 9 && ~~state.phoneNumber.value) {
            state.phoneNumber.validationStatus = 'success';
        } else {
            state.phoneNumber.message = 'Please provide a valid phone number'
            state.phoneNumber.validationStatus = 'error';
            valid = false;
        }
        // Country
        if (state.country.value !== 0) {
            state.country.validationStatus = 'success';
        } else {
            state.country.message = 'Please select a country'
            state.country.validationStatus = 'error';
            valid = false;
        }
        // State
        if (state.state.value !== 0) {
            state.state.validationStatus = 'success';
        } else {
            state.state.message = 'Please select a state';
            state.state.validationStatus = 'error';
            valid = false;
        }
        this.setState(state);
        return valid;
    }

    onSubmit() {
        if (this.validateForm()) {
            TTTPost("/register", {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                city: this.state.city,
                zipCode: this.state.zipCode,
                countryid: this.state.country,
                stateprovid: this.state.state,
                phoneNumber: this.state.phoneNumber

            })
                .then(res => {
                    if (res.data.errorMessage) {
                        alert(res.data.errorMessage);
                    }
                    this.props.setInProgress(res.data.registrationStatus);
                });
        }
    }

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


    render() {
        return (
            <div className="globalBody globalImage">
                <div className="globalBody globalImageOverlay">
                    <div className="wrapper registrationViewDivPadding">
                        <h1 className="text-center registrationViewH1">Registering An Account With Trust The
                            Tickets!</h1>
                        <Grid>
                            <Row>
                                <Col className='registrationViewCol' sm={6} md={6} lg={6}>
                                    <Form>
                                        <FormGroup
                                            controlId="formControlsEmail"
                                            validationState={this.state.email.validationStatus}>
                                            <ControlLabel>Email address</ControlLabel>
                                            <FormControl placeholder="Enter email" type="email"
                                                         value={this.state.email.value}
                                                         name="email"
                                                         onChange={this.handleChange.bind(this)}/>
                                            <HelpBlock>{this.state.email.message}</HelpBlock>
                                        </FormGroup>
                                        <FormGroup
                                            controlId="formControlsPassword"
                                            validationState={this.state.password.validationStatus}>
                                            <ControlLabel>Password</ControlLabel>
                                            <FormControl placeholder="Enter Password"
                                                         type="password"
                                                         value={this.state.password.value}
                                                         name="password"
                                                         onChange={this.handleChange.bind(this)}/>
                                            <HelpBlock>{this.state.password.message}</HelpBlock>
                                        </FormGroup>
                                        <FormGroup
                                            controlId="formControlsPassword"
                                            validationState={this.state.secondPassword.validationStatus}>
                                            <ControlLabel>Confirm Password</ControlLabel>
                                            <FormControl placeholder="Confirm Password"
                                                         type="password"
                                                         value={this.state.secondPassword.value}
                                                         name="secondPassword"
                                                         onChange={this.handleChange.bind(this)}/>
                                            <HelpBlock>{this.state.secondPassword.message}</HelpBlock>
                                        </FormGroup>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="First Name"
                                            placeholder="Enter First Name"
                                            name="firstName"
                                            help={this.state.firstName.message}
                                            validationState={this.state.firstName.validationStatus}
                                            value={this.state.firstName.value}
                                            onChange={this.handleChange.bind(this)}/>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="Last Name"
                                            placeholder="Enter Last Name"
                                            name="lastName"
                                            help={this.state.lastName.message}
                                            validationState={this.state.lastName.validationStatus}
                                            value={this.state.lastName.value}
                                            onChange={this.handleChange.bind(this)}/>
                                    </Form>
                                </Col>
                                <Col className='registrationViewCol' sm={6} md={6} lg={6}>
                                    <Form>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="Address"
                                            placeholder="Enter Your Address"
                                            name="address"
                                            help={this.state.address.message}
                                            validationState={this.state.address.validationStatus}
                                            value={this.state.address.value}
                                            onChange={this.handleChange.bind(this)}/>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="City"
                                            placeholder="Enter City"
                                            name="city"
                                            help={this.state.city.message}
                                            validationState={this.state.city.validationStatus}
                                            value={this.state.city.value}
                                            onChange={this.handleChange.bind(this)}/>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="Zip Code"
                                            placeholder="Enter Zip Code"
                                            name="zipCode"
                                            help={this.state.zipCode.message}
                                            validationState={this.state.zipCode.validationStatus}
                                            value={this.state.zipCode.value}
                                            onChange={this.handleChange.bind(this)}/>
                                        <div className="registrationViewInlineGroup">
                                            <Form inline>
                                                <FormGroup className="registrationViewCountryForm"
                                                           controlId="formControlsSelect"
                                                           validationState={this.state.country.validationStatus}>
                                                    <ControlLabel style={{paddingRight: '10px'}}>Country</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                 placeholder="Country"
                                                                 name="country"
                                                                 onChange={this.handleChange.bind(this)}>
                                                        {/*This needs to populated with all countries in future*/}
                                                        <option value={0}>Country</option>
                                                        <option value={1}>US</option>
                                                    </FormControl>
                                                    <HelpBlock>{this.state.country.message}</HelpBlock>
                                                </FormGroup>
                                                <FormGroup className="registrationViewStateForm"
                                                           controlId="formControlsSelect"
                                                           validationState={this.state.state.validationStatus}>
                                                    <ControlLabel className='registrationViewControlLabel'>State</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                 placeholder="State"
                                                                 name="state"
                                                                 onChange={this.handleChange.bind(this)}>
                                                        {/*This needs to populated via country selection in future*/}
                                                        <option value={0}>State</option>
                                                        <option value={1}>AL</option>
                                                        <option value={2}>AK</option>
                                                        <option value={3}>AZ</option>
                                                        <option value={4}>AR</option>
                                                        <option value={5}>CA</option>
                                                        <option value={6}>CO</option>
                                                        <option value={7}>CT</option>
                                                        <option value={8}>DE</option>
                                                        <option value={9}>FL</option>
                                                        <option value={10}>GA</option>
                                                        <option value={11}>HI</option>
                                                        <option value={12}>ID</option>
                                                        <option value={13}>IL</option>
                                                        <option value={14}>IN</option>
                                                        <option value={15}>IA</option>
                                                        <option value={16}>KS</option>
                                                        <option value={17}>KY</option>
                                                        <option value={18}>LA</option>
                                                        <option value={19}>ME</option>
                                                        <option value={20}>MD</option>
                                                        <option value={21}>MA</option>
                                                        <option value={22}>MI</option>
                                                        <option value={23}>MN</option>
                                                        <option value={24}>MS</option>
                                                        <option value={25}>MO</option>
                                                        <option value={26}>MT</option>
                                                        <option value={27}>NE</option>
                                                        <option value={28}>NV</option>
                                                        <option value={29}>NH</option>
                                                        <option value={30}>NJ</option>
                                                        <option value={31}>NM</option>
                                                        <option value={32}>NY</option>
                                                        <option value={33}>NC</option>
                                                        <option value={34}>ND</option>
                                                        <option value={35}>OH</option>
                                                        <option value={36}>OK</option>
                                                        <option value={37}>OR</option>
                                                        <option value={38}>PA</option>
                                                        <option value={39}>RI</option>
                                                        <option value={40}>SC</option>
                                                        <option value={41}>SD</option>
                                                        <option value={42}>TN</option>
                                                        <option value={43}>TX</option>
                                                        <option value={44}>UT</option>
                                                        <option value={45}>VT</option>
                                                        <option value={46}>VA</option>
                                                        <option value={47}>WA</option>
                                                        <option value={48}>WV</option>
                                                        <option value={49}>WI</option>
                                                        <option value={50}>WY</option>
                                                    </FormControl>
                                                    <HelpBlock>{this.state.state.message}</HelpBlock>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                        <Form>
                                            <FieldGroup
                                                id="formControlsText"
                                                type="text"
                                                label="Phone Number"
                                                placeholder="Enter Phone Number"
                                                name="phoneNumber"
                                                help={this.state.phoneNumber.message}
                                                validationState={this.state.phoneNumber.validationStatus}
                                                value={this.state.phoneNumber.value}
                                                onChange={this.handleChange.bind(this)}
                                            />
                                        </Form>
                                    </Form>
                                </Col>
                            </Row>
                        </Grid>

                        <div className="registrationViewRegisterButton">
                            <Button bsStyle="primary"
                                    onClick={this.onSubmit.bind(this)}>
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

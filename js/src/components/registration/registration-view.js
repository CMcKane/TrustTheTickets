import React, {Component} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Form, Button, Col, Row, Grid} from 'react-bootstrap';
import {TTTPost} from '../backend/ttt-request';
import '../../stylesheet.css';

function FieldGroup({id, label, help, ...props}) {
    return (
        <FormGroup controlId={id}>
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
            email: '',
            password: '',
            secondPassword: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            zipCode: '',
            countryid: 0,
            stateprovid: 0,
            phoneNumber: ''
        };
    }

    getValidationState() {
        const length = this.state.password.length;
        if (length > 7) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    getSecondPasswordValidationState() {
        const length = this.state.secondPassword.length;
        if (length > 7 && this.state.password === this.state.secondPassword)
            return 'success';
        else if (length > 5 && this.state.password === this.state.secondPassword)
            return 'warning';
        else if (length > 0) return 'error';
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit() {
        if (this.getValidationState() === 'error') {
            this.alertRegistrationError('Password not long enough.');
        }
        else if (this.getSecondPasswordValidationState() === 'error') {
            this.alertRegistrationError('Passwords do not match.');
        }
        else {
            TTTPost("/register", {
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                city: this.state.city,
                zipCode: this.state.zipCode,
                countryid: this.state.countryid,
                stateprovid: this.state.stateprovid,
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

    // Eventually change to a popup modal
    alertRegistrationError(message) {
        alert(message);
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
                <div className=" globalBody globalImageOverlay">
                    <div className="wrapper registrationViewDivPadding">
                        <h1 className="text-center registrationViewH1">Registering An Account With Trust The
                            Tickets!</h1>
                        <Grid>
                            <Row>
                                <Col className='registrationViewCol' sm={6} md={6} lg={6}>
                                    <Form>
                                        <FormGroup
                                            controlId="formControlsEmail">
                                            <ControlLabel>Email address</ControlLabel>
                                            <FormControl placeholder="Enter email" type="email"
                                                         value={this.state.email}
                                                         name="email"
                                                         onChange={this.handleChange.bind(this)}/>
                                        </FormGroup>
                                        <FormGroup
                                            controlId="formControlsPassword"
                                            validationState={this.getValidationState()}>
                                            <ControlLabel>Password</ControlLabel>
                                            <FormControl placeholder="Enter Password"
                                                         type="password"
                                                         value={this.state.password}
                                                         name="password"
                                                         onChange={this.handleChange.bind(this)}/>
                                        </FormGroup>
                                        <FormGroup
                                            controlId="formControlsPassword"
                                            validationState={this.getSecondPasswordValidationState()}>
                                            <ControlLabel>Confirm Password</ControlLabel>
                                            <FormControl placeholder="Confirm Password"
                                                         type="password"
                                                         value={this.state.secondPassword}
                                                         name="secondPassword"
                                                         onChange={this.handleChange.bind(this)}/>
                                        </FormGroup>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="First Name"
                                            placeholder="Enter First Name"
                                            name="firstName"
                                            value={this.state.firstName}
                                            onChange={this.handleChange.bind(this)}
                                        />
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="Last Name"
                                            placeholder="Enter Last Name"
                                            name="lastName"
                                            value={this.state.lastName}
                                            onChange={this.handleChange.bind(this)}
                                        />
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
                                            value={this.state.address}
                                            onChange={this.handleChange.bind(this)}
                                        />
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="City"
                                            placeholder="Enter City"
                                            name="city"
                                            value={this.state.city}
                                            onChange={this.handleChange.bind(this)}
                                        />
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="Zip Code"
                                            placeholder="Enter Zip Code"
                                            name="zipCode"
                                            value={this.state.zipCode}
                                            onChange={this.handleChange.bind(this)}
                                        />
                                        <div className="registrationViewInlineGroup">
                                            <Form inline>
                                                <FormGroup className="registrationViewCountryForm"
                                                           controlId="formControlsSelect">
                                                    <ControlLabel style={{paddingRight: '10px'}}>Country</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                 placeholder="Country"
                                                                 name="countryid"
                                                                 onChange={this.handleChange.bind(this)}>
                                                        {/*This needs to populated with all countries in future*/}
                                                        <option value={0}>Country</option>
                                                        <option value={1}>US</option>
                                                    </FormControl>
                                                </FormGroup>
                                                <FormGroup className="registrationViewStateForm"
                                                           controlId="formControlsSelect">
                                                    <ControlLabel className='registrationViewControlLabel'>State</ControlLabel>
                                                    <FormControl componentClass="select"
                                                                 placeholder="State"
                                                                 name="stateprovid"
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
                                                value={this.state.phoneNumber}
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

import React, { Component }  from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock, Form, Button } from 'react-bootstrap';
import { TTTPost } from '../backend/ttt-request';

function FieldGroup({ id, label, help, ...props }) {
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
          secondPassword: ''
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
        else if (length > 0 ) return 'error';
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit() {
        if (this.getValidationState() === 'error')
        {
            this.alertRegistrationError('Password not long enough.');
        }
        else if (this.getSecondPasswordValidationState() === 'error')
        {
            this.alertRegistrationError('Passwords do not match.');
        }
        else
        {
            TTTPost("/register", {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                if(res.data.errorMessage) {
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
                if(res.data.errorMessage) {
                    alert(res.data.errorMessage);
                }
                else
                {
                    this.setState({completed: true});
                }
            });
    }

    render() {
        console.log(this.props);
        return (
            <div className="centered">
                    <h1 className="text-center">Registration</h1>
                    <form>
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
                            <FormControl type="password"
                                         value={this.state.password}
                                         name="password"
                                         onChange={this.handleChange.bind(this)}/>
                        </FormGroup>
                        <FormGroup
                            controlId="formControlsPassword"
                            validationState={this.getSecondPasswordValidationState()}>
                            <ControlLabel>Re-enter Password</ControlLabel>
                            <FormControl type="password"
                                         value={this.state.secondPassword}
                                         name="secondPassword"
                                         onChange={this.handleChange.bind(this)}/>
                        </FormGroup>
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="First Name"
                            placeholder="Enter First Name"
                        />
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Last Name"
                            placeholder="Enter Last Name"
                        />
                        <FieldGroup
                        id="formControlsText"
                        type="text"
                        label="Address"
                        placeholder="Enter Your Address"
                         />
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="City"
                            placeholder="Enter City"
                        />
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Zip Code"
                            placeholder="Enter Zip Code"
                        />
                        <Form inline>
                            <FormGroup
                                controlId="formControlsSelect">
                                <ControlLabel>Country</ControlLabel>
                                <FormControl componentClass="select"
                                             placeholder="Country">
                                    {/*This needs to populated with all countries in future*/}
                                    <option value="United States">US</option>
                                </FormControl>
                            </FormGroup>
                            <FormGroup
                                controlId="formControlsSelect">
                                <ControlLabel>State</ControlLabel>
                                <FormControl componentClass="select"
                                             placeholder="State">
                                    {/*This needs to populated via country selection in future*/}
                                    <option value="Alabama">AL</option>
                                    <option value="Alaska">AK</option>
                                    <option value="Arizona">AZ</option>
                                    <option value="Arkansas">AR</option>
                                    <option value="California">CA</option>
                                    <option value="Colorado">CO</option>
                                    <option value="Connecticut">CT</option>
                                    <option value="Delaware">DE</option>
                                    <option value="Florida">FL</option>
                                    <option value="Georgia">GA</option>
                                    <option value="Hawaii">HI</option>
                                    <option value="Idaho">ID</option>
                                    <option value="Illinois">IL</option>
                                    <option value="Indiana">IN</option>
                                    <option value="Iowa">IA</option>
                                    <option value="Kansas">KS</option>
                                    <option value="Kentucky">KY</option>
                                    <option value="Louisiana">LA</option>
                                    <option value="Maine">ME</option>
                                    <option value="Maryland">MD</option>
                                    <option value="Massachusetts">MA</option>
                                    <option value="Michigan">MI</option>
                                    <option value="Minnesota">MN</option>
                                    <option value="Mississippi">MS</option>
                                    <option value="Missouri">MO</option>
                                    <option value="Montana">MT</option>
                                    <option value="Nebraska">NE</option>
                                    <option value="Nevada">NV</option>
                                    <option value="New Hampshire">NH</option>
                                    <option value="New Jersey">NJ</option>
                                    <option value="New Mexico">NM</option>
                                    <option value="New York">NY</option>
                                    <option value="North Carolina">NC</option>
                                    <option value="North Dakota">ND</option>
                                    <option value="Ohio">OH</option>
                                    <option value="Oklahoma">OK</option>
                                    <option value="Oregon">OR</option>
                                    <option value="Pennsylvania">PA</option>
                                    <option value="Rhode Island">RI</option>
                                    <option value="South Carolina">SC</option>
                                    <option value="South Dakota">SD</option>
                                    <option value="Tennessee">TN</option>
                                    <option value="Texas">TX</option>
                                    <option value="Utah">UT</option>
                                    <option value="Vermont">VT</option>
                                    <option value="Virginia">VA</option>
                                    <option value="Washington">WA</option>
                                    <option value="West Virginia">WV</option>
                                    <option value="Wisconsin">WI</option>
                                    <option value="Wyoming">WY</option>
                                </FormControl>
                            </FormGroup>
                        </Form>

                        <Button bsStyle="primary"
                                onClick={this.onSubmit.bind(this)}>
                            Register
                        </Button>

                    </form>
                </div>
        );
    }
}

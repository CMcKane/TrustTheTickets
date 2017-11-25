import React, { Component }  from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class RegistrationConfirmation extends Component {

	render() {
		return(
			<div className="text-center" style={{color: 'white'}}>
				<h1> Registration complete! </h1>
			    <LinkContainer to="/login">
                    <Button bsStyle="primary">
                       	Click here to login
                    </Button>
                </LinkContainer>
			</div>
		);
	}
}
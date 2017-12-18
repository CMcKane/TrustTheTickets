import React, { Component }  from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {Redirect} from 'react-router-dom';

/**
* This component is responsible for handling the confirmation of
* a new account registration.
*/
export default class RegistrationConfirmation extends Component {

    /**
    * Constructor
    */
    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }

    /**
    * Triggered on page load.
    */
	componentDidMount() {
        this.timeoutHandle = setTimeout(() => {
            this.setState({redirect: true});
        }, 5000);
    }

    /**
    * Triggered on page un load.
    */
    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    /**
    * Renders the web page.
    */
	render() {
		if (this.state.redirect) {
			return <Redirect to={"/my-account"} />;
		}
		return(
			<div className="text-center" style={{color: 'black'}}>
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
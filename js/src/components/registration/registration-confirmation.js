import React, { Component }  from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {Redirect} from 'react-router-dom';

export default class RegistrationConfirmation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }

	componentDidMount() {
        this.timeoutHandle = setTimeout(() => {
            this.setState({redirect: true});
        }, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

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
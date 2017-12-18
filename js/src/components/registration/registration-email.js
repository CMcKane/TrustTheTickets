import React, { Component }  from 'react';
import {Redirect} from 'react-router-dom';

/**
* This component sends out the registration confirmation email to the user.
*/
export default class RegistrationEmail extends Component {

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
	    // Redirects after 5 seconds.
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
				<p> You've been sent an email to confirm your email address. It should arrive shortly. </p>
			</div>
		);
	}
}
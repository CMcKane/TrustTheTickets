import React, { Component }  from 'react';
import {Redirect} from 'react-router-dom';

export default class RegistrationEmail extends Component {

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
				<p> You've been sent an email to confirm your email address. It should arrive shortly. </p>
			</div>
		);
	}
}
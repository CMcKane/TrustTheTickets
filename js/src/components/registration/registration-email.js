import React, { Component }  from 'react';
import '../../stylesheet.css';

export default class RegistrationEmail extends Component {

	render() {
		return(
			<div className="text-center" style={{color: 'black'}}>
				<p> You've been sent an email to confirm your email address. It should arrive shortly. </p>
			</div>
		);
	}
}
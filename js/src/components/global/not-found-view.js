import React, { Component }  from 'react';

export default class NotFoundView extends Component {

	render() {
		return (
			<div className="text-center" style={{color: 'black', paddingTop: '20%'}}>
				<h1> 404 </h1>
				<h2> Not found, oh no! </h2>
			</div>
		);
	}
}
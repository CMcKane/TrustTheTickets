import React, { Component }  from 'react';

/**
* Creates a web pge used for the error 404 not found.
*/
export default class NotFoundView extends Component {

    /**
    * Main rendering loop.
    */
	render() {
		return (
			<div className="text-center" style={{color: 'black', paddingTop: '20%'}}>
				<h1> 404 </h1>
				<h2> Not found, oh no! </h2>
			</div>
		);
	}
}
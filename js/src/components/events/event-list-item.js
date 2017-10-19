import React, { Component }  from 'react';

export default class EventListItem extends Component {

	render() {
		return (
			<div className='unselectable'>
				<p>
					{this.props.event.title}
				</p>
			</div>
		);
	}
}
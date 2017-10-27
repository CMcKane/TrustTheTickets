import React, { Component }  from 'react';
import '../pick-tickets/pick-tickets.css';

export default class TicketListItem extends Component {

	render() {
		return (
			<div className='unselectable'>
				<p>
					{this.props.tickets.id}
				</p>
			</div>
		);
	}
}
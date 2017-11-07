import React, {Component} from 'react';
import {TTTPost} from '../../backend/ttt-request';
import withAuth from '../../auth/with-auth';
import AuthService from '../../auth/auth-service';
import _ from 'lodash';
import ListingItem from './listing-item';
import { Grid, Col } from 'react-bootstrap';

const listings = [
{
	awayTeam: "Cavaliers",
	date: "12/1/2016",
	cost: "135.00",
	section: "201",
	row: "12",
	seats: [12, 13, 14],
	groupID: 42
},
{
	awayTeam: "Celtics",
	date: "11/1/2017",
	cost: "120.00",
	section: "211",
	row: "20",
	seats: [1, 2, 3,4],
	groupdID: 20
}
]

class ListingsView extends Component {

	constructor(props) {
		super(props);
		this.Auth = new AuthService();
		this.state = {

		}
	}

	componentDidMount() {
		this.getListings();
	}

	getListings() {
		this.setState({listings: listings});
	}

	renderListings() {
		return _.map(this.state.listings, (listing, index) =>
            <ListingItem listing={listing} />
        );
	}

	render() {
        return (
            <div className='globalBody globalImage'>
                <div className='globalBody globalImageOverlay'>
	        		<Grid>
	        			<Col xs={1} sm={1} md={2} lg={2}>
	        			</Col>
	        			<Col xs={10} sm={10} md={8} lg={8}>
	                		<h1 className="text-center" style={{color: 'black'}}> Current Listings </h1>
	                		{this.renderListings()}
	                	</Col>
	                	<Col xs={1} sm={11} md={2} lg={2}>
	                	</Col>
	                </Grid>
	            </div>
	        </div>
	    );
	}
}

export default withAuth(ListingsView);

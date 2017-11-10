import React, {Component} from 'react';
import {TTTPost} from '../../backend/ttt-request';
import withAuth from '../../auth/with-auth';
import AuthService from '../../auth/auth-service';
import _ from 'lodash';
import ListingItem from './listing-item';
import { Grid, Col } from 'react-bootstrap';
import '../../../stylesheet.css';

const listings = [
{
	awayTeam: "Cavaliers",
	homeTeam: "76ers",
	date: "12/1/2016",
	price: "135.00",
	section: "201",
	row: "12",
	seats: [12, 13, 14],
	groupID: 42,
	transactionID: null,
	transactionDate: null,
	transactionTotal: null,
	chargesTotal: null,
	minSellSize: 1
},
{
	awayTeam: "Celtics",
	homeTeam: "76ers",
	date: "11/1/2017",
	price: "120.00",
	section: "211",
	row: "20",
	seats: [1, 2, 3,4],
	groupdID: null,
	transactionID: 1,
	transactionDate: "11/18/2017",
	transactionTotal: 528.00,
	chargesTotal: 48.00,
	minSellSize: null
},
{
	awayTeam: "Suns",
	homeTeam: "76ers",
	date: "10/16/2017",
	price: "100.00",
	section: "117",
	row: "8",
	seats: [19, 20, 21, 22],
	groupdID: null,
	transactionID: 2,
	transactionDate: "10/18/2017",
	transactionTotal: 440.00,
	chargesTotal: 40.00,
	minSellSize: null
},
{
	awayTeam: "Lakers",
	homeTeam: "76ers",
	date: "10/17/2017",
	price: "100.00",
	section: "217",
	row: "18",
	seats: [12, 13],
	groupdID: null,
	transactionID: 3,
	transactionDate: "10/18/2017",
	transactionTotal: 220.00,
	chargesTotal: 20.00,
	minSellSize: null
},
{
	awayTeam: "Heat",
	homeTeam: "76ers",
	date: "10/18/2017",
	price: "100.00",
	section: "110",
	row: "87",
	seats: [9, 10],
	groupdID: null,
	transactionID: 4,
	transactionDate: "10/19/2017",
	transactionTotal: 220.00,
	chargesTotal: 20.00,
	minSellSize: null
}
]

class ListingsView extends Component {

	constructor(props) {
		super(props);
		this.Auth = new AuthService();
		this.state = {
			listings: null
		}
	}

	componentDidMount() {
		this.getListings();
	}

	getListings() {
		TTTPost('/your-listings', {
			token: this.Auth.getToken()
		})
		.then(res => {
			console.log(res);
			if (res.data.authenticated) {
				this.setState({
					listings: res.data.listings
				});
			}
		});
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
	        		<Grid className='listingsViewGrid'>
	        			<Col xs={0} sm={1} md={2} lg={2}>
	        			</Col>
	        			<Col xs={12} sm={10} md={8} lg={8} style={{height: '100%', paddingBottom: '40px'}}>
	                		<h1 className="listingTitle listingsViewH1">
	                			Your Listing History 
	             			</h1>
	                		<div className='listingsViewTicketListingWindow' >
	                			{this.renderListings()}
	                		</div>
	                	</Col>
	                	<Col xs={0} sm={11} md={2} lg={2}>
	                	</Col>
	                </Grid>
	            </div>
	        </div>
	    );
	}
}

export default withAuth(ListingsView);

import React, {Component} from 'react';
import {TTTPost} from '../../backend/ttt-request';
import withAuth from '../../auth/with-auth';
import AuthService from '../../auth/auth-service';
import _ from 'lodash';
import PurchaseItem from './purchase-item';
import { Grid, Col } from 'react-bootstrap';
import '../../../stylesheet.css';

class PurchasesView extends Component {

	constructor(props) {
		super(props);
		this.Auth = new AuthService();
		this.state = {
			purchases: []
		}
	}

	componentDidMount() {
		this.getListings();
	}

	getListings() {
		TTTPost('/your-purchases', {
			token: this.Auth.getToken()
		})
		.then(res => {
			if (res.data.authenticated) {
				this.setState({
					purchases: res.data.purchases
				});
			}
		});
	}

	renderListings() {
		return _.map(this.state.purchases, (purchase, index) =>
            <PurchaseItem key={index} purchase={purchase} />
        );
	}

	render() {
        return (
            <div>
                <div style={{paddingBottom: '0px'}}>
	        		<Grid className='listingsViewGrid'>
	        			<Col xs={0} sm={1} md={2} lg={2}>
	        			</Col>
	        			<Col xs={12} sm={10} md={8} lg={8} style={{height: '100%', paddingBottom: '40px'}}>
	                		<h1 className="listingTitle listingsViewH1">
	                			Your Purchase History 
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

export default withAuth(PurchasesView);

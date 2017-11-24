import React, { Component }  from 'react';
import _ from 'lodash';
import {Grid, Table, Col, Button, Well} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import withAuth from '../auth/with-auth';
import AuthService from '../auth/auth-service';
import '../../stylesheet.css';
import ReactCountdownClock from 'react-countdown-clock';
import ReactTimeout from 'react-timeout';
import queryString from 'query-string';

export default class CheckoutLanding extends Component {



    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        const queryParams = queryString.parse(this.props.location.search);
        this.state = {
            eventID: queryParams.event,
            redirect: false
        }
    }

    componentDidMount(){
         this.timeoutHandle = setTimeout(()=>{
              this.setState({redirect: true});
         }, 5000);
    }

    componentWillUnmount(){
         clearTimeout(this.timeoutHandle);

    }

	render() {
	    if(this.state.redirect)
	    {
	        return <Redirect to={"/pick-tickets?event=" + this.state.eventID} />
	    }
	    else
	    {
            return(
            <div className="globalBody globalImage">
                <Grid style={{paddingTop: "25px", height: '80%'}}>
                    <h2>
                        <Well className='checkoutHeader'>
                            Your order has been sent... Redirecting in 5 seconds.
                        </Well>
                    </h2>
                </Grid>
            </div>
            );
        }
    }
}


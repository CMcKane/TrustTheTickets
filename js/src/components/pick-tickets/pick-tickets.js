import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import Slider from 'react-rangeslider'



export default class PickTickets extends Component {



    constructor(props) {
        super(props);
        console.log("AHHHHHHHHHHHHHHHHHHHHHH22222222222222222222222");

        this.state = {
            section: '',
            tickets: [],
            sliderValue: 0,
            sliderChange: 0,
            sliderStep: 2,
            sliderMax: 2000,
            sliderMin: 0,
            price: 0
        }
    }



    onChartClick(section) {

        if(section.length > 0) {
            TTTPost('/tickets', {
                section_number: section
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
            
        }
    }


    renderTickets() {
        return _.map(this.state.tickets, (ticket, index) =>
            <option key={index} value={ticket.ticket_id}>
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number}
            </option>
        );
    }

    firstComponentChangeValue(e) {
      console.log("AHHHHHHHHHHHHHHHHHHHHHH");
      console.log(this.state.priceChange);
      this.setState({ firstComponentCurrentValue: e.target.value });
      this.setState({ priceChange: e.target.value });
      return e.target.value;

    }

    handleOnChange = (value) => {
    this.setState({
      price: value
    })
  }

    render(){
        return (



            <Grid>

                <h1 className="border-white">
                    <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                        Choose Your Desired Section From The Seating Chart 
                    </Well>
                </h1>
                <Row>
                    <Col lg={8}>
                        <WellsFargoChart 
                        onSectionSelected={this.onChartClick.bind(this)} 
                        selectedSection={this.state.section}/>
                    </Col>
                    <Col lg={4}>

                        <div>
                                <ReactSliderNativeBootstrap
                                     max={50}
                                     min={1}
                                     step={1}
                                     tooltip="hide"
                                     change={this.firstComponentChangeValue}
                                     value={this.state.firstComponentCurrentValue}
                                />

                                <ControlLabel
                                    id = "sliderPrice"
                                    style={{color: 'white', fontSize: 15}}>
                                    {this.state.price}
                                </ControlLabel>

                            <form>
                                <ControlLabel style={{color: 'white', fontSize: 15}}>Section #: </ControlLabel>
                                <input name="param1" value="test"/>
                                <input type="submit" name="" id="search-submit" class="button" value="Submit"/>
                            </form>

                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel style={{color: 'white', fontSize: 25}}>Here are your ticket options for selected section: </ControlLabel>
                                <FormControl style={{height: '650px'}} componentClass="select" multiple>
                                {this.renderTickets()}
                                </FormControl>
                            </FormGroup>




                        </div>}
                    </Col>
                    <Col lg={4}>
                        {
                        <div>
                            <span>{this.props.todo}</span>
                            <input type="checkbox" checked={this.props.done} />

                            <form>
                              <input name="param1" value="test"/>
                                <input name="param2" value=""/>
                                <input type="submit" name="" id="search-submit" class="button" value="Submit"/>
                            </form>
                        </div>
                      }
                    </Col>
                </Row>
            </Grid>
        );
    }
}
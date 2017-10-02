import React, { Component } from 'react';
import '../seating-chart.css';

export default class WellsFargoChart extends Component {

	constructor(props) {
      super(props);

      this.state = {
          text: 'Select a section'
      };
	}

	onChartClick(area) {
		if(area.length > 0) area = "You've selected " + area;
		this.setState({text: area});
	}	

	render() {
		return (
			<div>
            <p>{this.state.text}</p>
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
				 viewBox="0 0 1069 1069">
				<path onClick={this.onChartClick.bind(this, 'A')} id="_x32_9744" className="st0" d="M186.3,208.5c0,0-7,7-9.1,9.9l-7.3-7.4c0,0,4-5.1,9.3-10.2L186.3,208.5z"/>
				<path onClick={this.onChartClick.bind(this, 'B')} id="_x32_9745" className="st0" d="M177.2,218.3c0,0-6.8,8.7-8.4,11.3l-7.9-6.5c0,0,4.6-7.1,8.9-12.2L177.2,218.3z"/>
				<path onClick={this.onChartClick.bind(this, 'C')} id="_x32_9746" className="st0" d="M153.6,235.8c2.4-5.2,7.3-12.6,7.3-12.6l7.9,6.5c-2.3,3.8-6.7,11.5-6.7,11.5L153.6,235.8z"/>
				<path onClick={this.onChartClick.bind(this, 'D')} id="_x32_9747" className="st0" d="M147.8,249.1c1.6-4.5,5.8-13.4,5.8-13.4l8.5,5.4c-2.3,4.5-5.3,12.2-5.3,12.2L147.8,249.1z"/>
				<path onClick={this.onChartClick.bind(this, 'E')} id="_x32_9748" className="st0" d="M143.9,261.1c0.8-3.7,3.9-11.9,3.9-11.9l9,4.2c-1.2,3-3.9,11-3.9,11L143.9,261.1z"/>
				<path onClick={this.onChartClick.bind(this, 'F')} id="_x32_9749" className="st0" d="M140.7,276.2v-0.3l3.3-14.9l9,3.3c-1.3,4.8-3.1,13.3-3.1,13.3L140.7,276.2z"/>
				<path onClick={this.onChartClick.bind(this, 'G')} id="_x32_9750" className="st0" d="M138.9,292.8c0-4.7,1.8-16.9,1.8-16.9l9.1,1.8c-1,3.9-2,15.8-2,15.8L138.9,292.8z"/>
				<path onClick={this.onChartClick.bind(this, 'H')} id="_x32_9751" className="st0" d="M138.9,308.4v-15.6l9,0.8v14.8H138.9z"/>
				<path onClick={this.onChartClick.bind(this, 'I')} id="_x32_9752" className="st0" d="M138.9,308.4h9v14.2h-9V308.4z"/>
				<path onClick={this.onChartClick.bind(this, 'J')} id="_x32_9753" className="st0" d="M138.9,322.5h9v14.2h-9V322.5z"/>
				<path onClick={this.onChartClick.bind(this, 'K')} id="_x32_9754" className="st0" d="M139.4,351.8c-0.6-5.1-0.5-15.1-0.5-15.1h9c0,4.2,0.5,14.1,0.5,14.1L139.4,351.8z"/>
				<path onClick={this.onChartClick.bind(this, 'L')} id="_x32_9755" className="st0" d="M141.6,367c-1-3.8-2.2-15.1-2.2-15.1l9-1c0.5,6.2,2.3,13.9,2.3,13.9L141.6,367z"/>
				<path onClick={this.onChartClick.bind(this, 'M')} id="_x32_9756" className="st0" d="M145.9,381.6c-1.7-4.4-4.3-14.6-4.3-14.6l9-2.3c1,4.6,3.5,13.2,3.5,13.2L145.9,381.6z"/>
				<path onClick={this.onChartClick.bind(this, 'N')} id="_x32_9757" className="st0" d="M151.3,394.7c-2.7-5.8-5.3-13.1-5.3-13.1l8.4-3.8c1.7,5.4,4.7,12.6,4.7,12.6L151.3,394.7z"/>
				<path onClick={this.onChartClick.bind(this, 'O')} id="_x32_9758" className="st0" d="M157.3,407.1c-2.1-3.9-6-12.4-6-12.4l7.7-4.2c1.4,3.6,6,11.6,6,11.6L157.3,407.1z"/>
				<path onClick={this.onChartClick.bind(this, 'P')} id="_x32_9759" className="st0" d="M165.5,419.3c-2.9-3.9-8.3-12.2-8.3-12.2l7.7-5c2.6,4.7,7.5,11.9,7.5,11.9L165.5,419.3z"/>
				<path onClick={this.onChartClick.bind(this, 'Q')} id="_x32_9760" className="st0" d="M175.1,430.9c-4-3.9-9.5-11.6-9.5-11.6l6.9-5.4c2.5,3.6,9.2,10.7,9.2,10.7L175.1,430.9z"/>
				<path onClick={this.onChartClick.bind(this, 'R')} id="_x32_9761" className="st0" d="M185.4,440.8c-3.4-2.9-10.3-9.9-10.3-9.9l6.6-6.3c1.6,2,9.4,9.3,9.4,9.3L185.4,440.8z"/>
				<path onClick={this.onChartClick.bind(this, 'CB2')} id="_x32_9762" className="st0" d="M316.8,192.4h-40.4v-27.8h40.4V192.4L316.8,192.4z"/>
				<path onClick={this.onChartClick.bind(this, 'CB3')} id="_x32_9763" className="st0" d="M276.4,192.4c0,0-30.1-1.8-43.5,3.4v-26.4c0,0,10.4-4.8,43.5-4.8V192.4z"/>
				<path onClick={this.onChartClick.bind(this, 'CB4')} id="_x32_9764" className="st0" d="M197.2,217.7l-16-19.2c0,0,19-18.7,43.4-26.7l8.3,24.1C232.9,195.8,210.1,202.4,197.2,217.7z"/>
				<path onClick={this.onChartClick.bind(this, 'CB10')} id="_x32_9765" className="st0" d="M232.4,466.2c0,0-24.6-7.2-44-22.9l12.8-17.9c0,0,11.2,12.3,37.4,19L232.4,466.2z"/>
				<path onClick={this.onChartClick.bind(this, 'CB11')} id="_x32_9766" className="st0" d="M281.4,471.2h-20c0,0-17.9-0.4-29-5l6.3-21.7c0,0,3.9,2.6,42.7,2.6V471.2z"/>
				<path onClick={this.onChartClick.bind(this, 'CB12')} id="_x32_9767" className="st0" d="M281.4,447h42v24.1h-42V447z"/>
				<path onClick={this.onChartClick.bind(this, 'CB14')} id="_x32_9768" className="st0" d="M354.3,446.9h42v24.3h-42L354.3,446.9L354.3,446.9z"/>
				<path onClick={this.onChartClick.bind(this, 'CB15')} id="_x32_9769" className="st0" d="M444.3,465.7c0,0-18.1,5.4-29.8,5.4s-18.1,0-18.1,0v-24.1c0,0,29.7,1.2,41.1-2.2L444.3,465.7z"/>
				<path onClick={this.onChartClick.bind(this, 'CB16')} id="_x32_9770" className="st0" d="M487.8,443.5c0,0-23.7,18.5-43.6,22.2l-6.8-20.8c0,0,22.8-4.7,38.6-18.8L487.8,443.5z"/>
				<path onClick={this.onChartClick.bind(this, 'PS22')} id="_x32_9771" className="st0" d="M473.7,211c0,0-17.2-13.8-39.1-17.7l5.9-25.3c0,0,23.5,4.5,46.5,23.5L473.7,211z"/>
				<path onClick={this.onChartClick.bind(this, 'CB23')} id="_x32_9772" className="st0" d="M431.5,192.4h-40.2v-27.8c0,0,20.9-1,41.2,1.7L431.5,192.4z"/>
				<path onClick={this.onChartClick.bind(this, 'CB24')} id="_x32_9773" className="st0" d="M391.4,192.4h-41.5v-27.8h41.5V192.4z"/>
				<path onClick={this.onChartClick.bind(this, 'SB1')} id="_x32_9774" className="st0" d="M349.9,192.4h-33.1v-27.8h33.1V192.4z"/>
				<path onClick={this.onChartClick.bind(this, 'SB13')} id="_x32_9775" className="st0" d="M323.4,446.9h30.9v24.3h-30.9V446.9z"/>
				<path onClick={this.onChartClick.bind(this, 'CC17')} id="_x32_9776" className="st0" d="M527.6,389.5c0,0-8.9,26.8-37.4,52l-9.1-14.2c0,0,18.1-13.1,32.7-44.9L527.6,389.5z"/>
				<path onClick={this.onChartClick.bind(this, '1')} id="_x32_9777" className="st0" d="M331.1,476.4h14.7v13.4h-14.7V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '2')} id="_x32_9778" className="st0" d="M317.3,476.4h13.8v13.4h-13.8V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '3')} id="_x32_9779" className="st0" d="M302.9,476.4h14.4v13.4h-14.4V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '4')} id="_x32_9780" className="st0" d="M289.1,476.4h13.8v13.4h-13.8V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '5')} id="_x32_9781" className="st0" d="M274,476.4h15.1v13.4H274V476.4L274,476.4z"/>
				<path onClick={this.onChartClick.bind(this, '6')} id="_x32_9782" className="st0" d="M274,489.8c0,0-12.7,0.2-14.5,0v-13.4c0,0,9.8,0,14.5,0V489.8L274,489.8z"/>
				<path onClick={this.onChartClick.bind(this, '7')} id="_x32_9783" className="st0" d="M259.5,489.8c0,0-10.9-0.6-16.4-2.1l2-13c0,0,11.8,1.7,14.5,1.7V489.8z"/>
				<path onClick={this.onChartClick.bind(this, '8')} id="_x32_9784" className="st0" d="M243.1,487.7c0,0-11.5-2.2-16.1-3.5l4.3-13c0,0,7.3,2.2,13.7,3.6L243.1,487.7z"/>
				<path onClick={this.onChartClick.bind(this, '9')} id="_x32_9785" className="st0" d="M227,484.2c0,0-10.5-3.3-14.7-5.1l5.5-12.3c0,0,9,3.1,13.6,4.4L227,484.2z"/>
				<path onClick={this.onChartClick.bind(this, '10')} id="_x32_9786" className="st0" d="M212.3,479.1c0,0-10.9-4.9-14.7-7.2l6.4-11.8c0,0,8.8,4.9,13.8,6.6L212.3,479.1z"/>
				<path onClick={this.onChartClick.bind(this, '11')} id="_x32_9787" className="st0" d="M197.6,471.9c0,0-8.4-4.9-12.7-8.2l7.8-11c0,0,6.5,4.9,11.2,7.4L197.6,471.9z"/>
				<path onClick={this.onChartClick.bind(this, '12')} id="_x32_9788" className="st0" d="M184.9,463.7c0,0-10.3-7.3-13-10.2l9-9.6c0,0,7.4,5.5,11.8,8.7L184.9,463.7z"/>
				<path onClick={this.onChartClick.bind(this, '13')} id="_x32_9789" className="st0" d="M171.9,453.5c0,0-10-8.8-11.8-11.8l10-8.3c0,0,7.2,7.1,10.8,10.5L171.9,453.5z"/>
				<path onClick={this.onChartClick.bind(this, '14')} id="_x32_9790" className="st0" d="M160.1,441.7c0,0-6.8-6.9-11.3-13.7l11.3-6.9c0,0,5.5,7.9,10,12.3L160.1,441.7z"/>
				<path onClick={this.onChartClick.bind(this, '15')} id="_x32_9791" className="st0" d="M148.8,428c0,0-5.8-8.2-8.4-13.2l11.4-6.2c0,0,5,8,8.3,12.5L148.8,428z"/>
				<path onClick={this.onChartClick.bind(this, '16')} id="_x32_9792" className="st0" d="M140.4,414.8c0,0-5.3-8.8-7.3-14.3l11.5-4.9c0,0,5.1,9.9,7.1,13L140.4,414.8z"/>
				<path onClick={this.onChartClick.bind(this, '17')} id="_x32_9793" className="st0" d="M133.1,400.5c0,0-3.4-6.9-5.6-14.2l11.3-4.2c0,0,3.6,9.3,5.8,13.5L133.1,400.5z"/>
				<path onClick={this.onChartClick.bind(this, '18')} id="_x32_9794" className="st0" d="M127.6,386.3c0,0-3.2-9.9-4.4-16.3l12.1-1.7c0,0,2,8.4,3.6,13.9L127.6,386.3z"/>
				<path onClick={this.onChartClick.bind(this, '19')} id="_x32_9795" className="st0" d="M123.2,370c0,0-1.4-7.8-2.1-13.9l11.4-1c0,0,1.5,9.3,2.9,13.1L123.2,370z"/>
				<path onClick={this.onChartClick.bind(this, '20')} id="_x32_9796" className="st0" d="M121.1,356.1c0,0-1.1-11.7-1.1-16.1h11.4c0,0,0.6,12.5,1.1,15.1L121.1,356.1z"/>
				<path onClick={this.onChartClick.bind(this, '21')} id="_x32_9797" className="st0" d="M120,325.7h11.4V340H120V325.7z"/>
				<path onClick={this.onChartClick.bind(this, '22')} id="_x32_9798" className="st0" d="M120,312.6h11.4v13.1H120V312.6z"/>
				<path onClick={this.onChartClick.bind(this, '23')} id="_x32_9799" className="st0" d="M131.3,312.6H120v-14.8l11.4,1.1V312.6z"/>
				<path onClick={this.onChartClick.bind(this, '24')} id="_x32_9800" className="st0" d="M131.3,299l-11.4-1.1c0,0,0.4-14.5,1-18.5l11.4,2C132.4,281.3,131.3,293,131.3,299z"/>
				<path onClick={this.onChartClick.bind(this, '25')} id="_x32_9801" className="st0" d="M132.4,281.3l-11.4-2c0,0,1.7-11.9,2.7-15.5l11.4,3.5C135.1,267.4,132.7,277.7,132.4,281.3z"/>
				<path onClick={this.onChartClick.bind(this, '26')} id="_x32_9802" className="st0" d="M135.1,267.4l-11.4-3.5c0,0,2-9.1,3.6-13.4l11.4,4.1C138.8,254.6,135.6,263.7,135.1,267.4z"/>
				<path onClick={this.onChartClick.bind(this, '27')} id="_x32_9803" className="st0" d="M138.8,254.6l-11.4-4.1c0,0,4.5-13.6,7.2-18.4l10.9,6.1C145.5,238.2,140.7,248.8,138.8,254.6z"/>
				<path onClick={this.onChartClick.bind(this, '28')} id="_x32_9804" className="st0" d="M145.5,238.2l-10.9-6.1c0,0,3.3-8.2,7.5-14.5l10,8.2C152.2,225.8,147.3,234.2,145.5,238.2z"/>
				<path onClick={this.onChartClick.bind(this, '29')} id="_x32_9805" className="st0" d="M152.2,225.8l-10-8.2c0,0,5.4-8.9,8.7-12.7l9.6,8.6C160.4,213.5,154.5,221.8,152.2,225.8z"/>
				<path onClick={this.onChartClick.bind(this, '30')} id="_x32_9806" className="st0" d="M160.4,213.5l-9.6-8.6c0,0,4.5-6.6,10.3-12.4l9,9.6C170.2,202.1,163.4,209.2,160.4,213.5z"/>
				<path onClick={this.onChartClick.bind(this, '31')} id="_x32_9807" className="st0" d="M170.2,202.1l-9-9.6c0,0,6.2-6.9,11.1-10.9l8.2,10.3C180.6,191.8,173,199.1,170.2,202.1z"/>
				<path onClick={this.onChartClick.bind(this, '32')} id="_x32_9808" className="st0" d="M180.6,191.8l-8.2-10.3c0,0,6.2-5.7,12.7-9.8l7.3,10.7C192.3,182.5,183.1,189.4,180.6,191.8z"/>
				<path onClick={this.onChartClick.bind(this, '33')} id="_x32_9809" className="st0" d="M204.9,174.6c0,0-9.9,5.8-12.7,7.8l-7.3-10.7c0,0,7.7-5.9,15.1-9.4L204.9,174.6z"/>
				<path onClick={this.onChartClick.bind(this, '34')} id="_x32_9810" className="st0" d="M218.6,168.4c0,0-9.8,4-13.6,6.2l-4.8-12.2c0,0,7-3.9,13.6-6.3L218.6,168.4z"/>
				<path onClick={this.onChartClick.bind(this, '35')} id="_x32_9811" className="st0" d="M232.5,163.6c0,0-9.7,3-14,4.8c-4.3,1.8-0.3,0.1-0.3,0.1l-4.5-12.5c0,0,8.3-3.2,15.7-5.4L232.5,163.6z"/>
				<path onClick={this.onChartClick.bind(this, '36')} id="_x32_9812" className="st0" d="M247,160.4c0,0-11.5,2.2-14.5,3.2l-3.1-12.9c0,0,5.6-1.6,15.8-3.4L247,160.4z"/>
				<path onClick={this.onChartClick.bind(this, '37')} id="_x32_9813" className="st0" d="M260.7,159.2c0,0-10.6,0.6-13.7,1.2l-1.7-13.1c0,0,8.8-1.4,15.4-1.4V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '38')} id="_x32_9814" className="st0" d="M276.4,159.2h-15.7v-13.3h15.7V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '39')} id="_x32_9815" className="st0" d="M291.9,159.2h-15.5v-13.3h15.5V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '40')} id="_x32_9816" className="st0" d="M306.3,159.2h-14.4v-13.3h14.4V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '41')} id="_x32_9817" className="st0" d="M320.2,159.2h-14v-13.3h14V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '42')} id="_x32_9818" className="st0" d="M335.2,159.2h-15v-13.3h15V159.2z"/>
				<path onClick={this.onChartClick.bind(this, '43')} id="_x32_9819" className="st0" d="M335.2,145.9h16.3v13.3h-16.3V145.9z"/>
				<path onClick={this.onChartClick.bind(this, '44')} id="_x32_9820" className="st0" d="M351.5,145.9h15.2v13.3h-15.2V145.9z"/>
				<path onClick={this.onChartClick.bind(this, '45')} id="_x32_9821" className="st0" d="M366.7,145.9h15.7v13.3h-15.7V145.9z"/>
				<path onClick={this.onChartClick.bind(this, '46')} id="_x32_9822" className="st0" d="M382.4,145.9h16.9v13.3h-16.9L382.4,145.9L382.4,145.9z"/>
				<path onClick={this.onChartClick.bind(this, '47')} id="_x32_9823" className="st0" d="M399.4,145.9h17.1v13.3h-17.1V145.9z"/>
				<path onClick={this.onChartClick.bind(this, '48')} id="_x32_9824" className="st0" d="M416.5,145.9c6.6,0,15.4,1.4,15.4,1.4l-1.7,13.1c-3.2-0.6-13.7-1.2-13.7-1.2V145.9z"/>
				<path onClick={this.onChartClick.bind(this, '49')} id="_x32_9825" className="st0" d="M431.9,147.3c10.3,1.9,15.8,3.4,15.8,3.4l-3.1,12.9c-3-0.9-14.5-3.2-14.5-3.2L431.9,147.3z"/>
				<path onClick={this.onChartClick.bind(this, '50')} id="_x32_9826" className="st0" d="M447.8,150.7c7.3,2.2,15.7,5.4,15.7,5.4l-4.5,12.5c0,0,4,1.7-0.3-0.1c-4.3-1.8-14-4.8-14-4.8
					L447.8,150.7z"/>
				<path onClick={this.onChartClick.bind(this, '51')} id="_x32_9827" className="st0" d="M463.4,156.1c6.6,2.4,13.6,6.3,13.6,6.3l-4.8,12.2c-3.8-2.2-13.6-6.2-13.6-6.2L463.4,156.1z"/>
				<path onClick={this.onChartClick.bind(this, '52')} id="_x32_9828" className="st0" d="M477.1,162.4c7.4,3.5,15.1,9.4,15.1,9.4l-7.3,10.7c-2.7-2.1-12.7-7.8-12.7-7.8L477.1,162.4z"/>
				<path onClick={this.onChartClick.bind(this, '53')} id="_x32_9829" className="st0" d="M484.9,182.5l7.3-10.7c6.5,4.1,12.7,9.8,12.7,9.8l-8.2,10.3C494.1,189.4,484.9,182.5,484.9,182.5z"/>
				<path onClick={this.onChartClick.bind(this, '54')} id="_x32_9830" className="st0" d="M496.6,191.8l8.2-10.3c5,4.1,11.1,10.9,11.1,10.9l-9,9.6C504.1,199.1,496.6,191.8,496.6,191.8z"/>
				<path onClick={this.onChartClick.bind(this, '55')} id="_x32_9831" className="st0" d="M507,202.1l9-9.6c5.8,5.8,10.3,12.4,10.3,12.4l-9.6,8.6C513.7,209.2,507,202.1,507,202.1z"/>
				<path onClick={this.onChartClick.bind(this, '56')} id="_x32_9832" className="st0" d="M516.8,213.5l9.6-8.6c3.3,3.8,8.7,12.7,8.7,12.7l-10,8.2C522.7,221.8,516.8,213.5,516.8,213.5z"/>
				<path onClick={this.onChartClick.bind(this, '57')} id="_x32_9833" className="st0" d="M525,225.8l10-8.2c4.2,6.3,7.5,14.5,7.5,14.5l-10.9,6.1C529.9,234.2,525,225.8,525,225.8z"/>
				<path onClick={this.onChartClick.bind(this, '58')} id="_x32_9834" className="st0" d="M531.7,238.2l10.9-6.1c2.7,4.8,7.2,18.4,7.2,18.4l-11.4,4.1C536.5,248.8,531.7,238.2,531.7,238.2z"/>
				<path onClick={this.onChartClick.bind(this, '59')} id="_x32_9835" className="st0" d="M538.4,254.6l11.4-4.1c1.7,4.2,3.6,13.4,3.6,13.4l-11.4,3.5C541.6,263.7,538.4,254.6,538.4,254.6z"/>
				<path onClick={this.onChartClick.bind(this, '60')} id="_x32_9836" className="st0" d="M542.1,267.4l11.4-3.5c1,3.5,2.7,15.5,2.7,15.5l-11.4,2C544.5,277.7,542.1,267.4,542.1,267.4z"/>
				<path onClick={this.onChartClick.bind(this, '61')} id="_x32_9837" className="st0" d="M544.8,281.3l11.4-2c0.6,3.9,1,18.5,1,18.5l-11.4,1.1C545.8,293,544.8,281.3,544.8,281.3z"/>
				<path onClick={this.onChartClick.bind(this, '62')} id="_x32_9838" className="st0" d="M545.8,299l11.4-1.1v14.8h-11.4V299z"/>
				<path onClick={this.onChartClick.bind(this, '63')} id="_x32_9839" className="st0" d="M557.2,325.7h-11.4v-13.1h11.4V325.7z"/>
				<path onClick={this.onChartClick.bind(this, '64')} id="_x32_9840" className="st0" d="M557.2,340h-11.4v-14.3h11.4V340z"/>
				<path onClick={this.onChartClick.bind(this, '65')} id="_x32_9841" className="st0" d="M544.8,355.1c0.4-2.6,1.1-15.1,1.1-15.1h11.4c0,4.4-1.1,16.1-1.1,16.1L544.8,355.1z"/>
				<path onClick={this.onChartClick.bind(this, '66')} id="_x32_9842" className="st0" d="M541.9,368.2c1.4-3.8,2.9-13.1,2.9-13.1l11.4,1c-0.7,6.1-2.1,13.9-2.1,13.9L541.9,368.2z"/>
				<path onClick={this.onChartClick.bind(this, '67')} id="_x32_9843" className="st0" d="M538.3,382.1c1.6-5.5,3.6-13.9,3.6-13.9L554,370c-1.2,6.5-4.4,16.3-4.4,16.3L538.3,382.1z"/>
				<path onClick={this.onChartClick.bind(this, '68')} id="_x32_9844" className="st0" d="M532.5,395.6c2.2-4.2,5.8-13.5,5.8-13.5l11.3,4.2c-2.1,7.3-5.6,14.2-5.6,14.2L532.5,395.6z"/>
				<path onClick={this.onChartClick.bind(this, '69')} id="_x32_9845" className="st0" d="M525.4,408.6c2-3.1,7.1-13,7.1-13l11.5,4.9c-2,5.5-7.3,14.3-7.3,14.3L525.4,408.6z"/>
				<path onClick={this.onChartClick.bind(this, '70')} id="_x32_9846" className="st0" d="M517.1,421.1c3.3-4.5,8.3-12.5,8.3-12.5l11.4,6.2c-2.6,5-8.4,13.2-8.4,13.2L517.1,421.1z"/>
				<path onClick={this.onChartClick.bind(this, '71')} id="_x32_9847" className="st0" d="M507,433.4c4.5-4.5,10-12.3,10-12.3l11.3,6.9c-4.5,6.9-11.3,13.7-11.3,13.7L507,433.4z"/>
				<path onClick={this.onChartClick.bind(this, '72')} id="_x32_9848" className="st0" d="M496.3,443.9c3.6-3.4,10.8-10.5,10.8-10.5l10,8.3c-1.8,2.9-11.8,11.8-11.8,11.8L496.3,443.9z"/>
				<path onClick={this.onChartClick.bind(this, '73')} id="_x32_9849" className="st0" d="M484.4,452.7c4.5-3.2,11.8-8.7,11.8-8.7l9,9.6c-2.7,2.9-13,10.2-13,10.2L484.4,452.7z"/>
				<path onClick={this.onChartClick.bind(this, '74')} id="_x32_9850" className="st0" d="M473.2,460.1c4.7-2.5,11.2-7.4,11.2-7.4l7.8,11c-4.2,3.3-12.7,8.2-12.7,8.2L473.2,460.1z"/>
				<path onClick={this.onChartClick.bind(this, '75')} id="_x32_9851" className="st0" d="M459.4,466.7c5-1.7,13.8-6.6,13.8-6.6l6.4,11.8c-3.8,2.3-14.7,7.2-14.7,7.2L459.4,466.7z"/>
				<path onClick={this.onChartClick.bind(this, '76')} id="_x32_9852" className="st0" d="M445.9,471.2c4.6-1.3,13.6-4.4,13.6-4.4l5.5,12.3c-4.2,1.8-14.7,5.1-14.7,5.1L445.9,471.2z"/>
				<path onClick={this.onChartClick.bind(this, '77')} id="_x32_9853" className="st0" d="M432.2,474.7c6.4-1.4,13.7-3.6,13.7-3.6l4.3,13c-4.6,1.3-16.1,3.5-16.1,3.5L432.2,474.7z"/>
				<path onClick={this.onChartClick.bind(this, '78')} id="_x32_9854" className="st0" d="M417.7,476.4c2.6,0,14.5-1.7,14.5-1.7l2,13c-5.5,1.6-16.4,2.1-16.4,2.1V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '79')} id="_x32_9855" className="st0" d="M401.6,476.4c5.2,0,16.1,0,16.1,0v13.4c-2,0.2-16.1,0-16.1,0V476.4z"/>
				<path onClick={this.onChartClick.bind(this, '80')} id="_x32_9856" className="st0" d="M401.6,489.8h-19.5v-13.4h19.5V489.8z"/>
				<path onClick={this.onChartClick.bind(this, '81')} id="_x32_9857" className="st0" d="M382.1,489.8h-17.8v-13.4h17.8V489.8z"/>
				<path onClick={this.onChartClick.bind(this, '82')} id="_x32_9858" className="st0" d="M364.3,489.8h-18.5v-13.4h18.5L364.3,489.8L364.3,489.8z"/>
				<path onClick={this.onChartClick.bind(this, '1')} id="_x32_9859" className="st0" d="M112,490.1l-19.4,21.1c0,0-28.5-27.7-42-57.4l23.5-14.5C74.1,439.4,92.1,471.2,112,490.1z"/>
				<path onClick={this.onChartClick.bind(this, '2')} id="_x32_9860" className="st0" d="M50.5,453.8c0,0-11.2-17.6-18.7-41.2L59,402.5c0,0,8.8,26.6,15.1,36.9L50.5,453.8z"/>
				<path onClick={this.onChartClick.bind(this, '3')} id="_x32_9861" className="st0" d="M59,402.5l-27.1,10.1c0,0-10-32.2-10.6-50.1l28.3-3.6C49.5,358.9,53.6,387.4,59,402.5z"/>
				<path onClick={this.onChartClick.bind(this, '4')} id="_x32_9862" className="st0" d="M49.5,358.9l-28.3,3.6c0,0-3.8-43.4-1.1-74.7l28.3,1.4C48.4,289.2,46.4,333.8,49.5,358.9z"/>
				<path onClick={this.onChartClick.bind(this, '5')} id="_x32_9863" className="st0" d="M62.6,222.3c-11.6,23.3-14.3,66.9-14.3,66.9l-28.3-1.4c0,0,2.1-44.4,16.4-77.4L62.6,222.3z"/>
				<path onClick={this.onChartClick.bind(this, '6')} id="_x32_9864" className="st0" d="M62.6,222.3l-26.1-11.9c0,0,10.2-31.9,28.7-54.3l22.9,18.5C88.2,174.6,74.2,189.5,62.6,222.3z"/>
				<path onClick={this.onChartClick.bind(this, '7')} id="_x32_9865" className="st0" d="M88.2,174.6l-22.9-18.5c0,0,18.7-24.1,35-38.8l21,19.9C121.3,137.1,101.3,154.8,88.2,174.6z"/>
				<path onClick={this.onChartClick.bind(this, '8')} id="_x32_9866" className="st0" d="M121.3,137.1l-21-19.9c0,0,19-17.4,47.7-32.7l11.3,25.6C159.3,110.1,138.2,119.5,121.3,137.1z"/>
				<path onClick={this.onChartClick.bind(this, '9')} id="_x32_9867" className="st0" d="M159.3,110.1L148,84.5c0,0,22-10.7,43.6-15.6l8.6,24.2C200.2,93.1,180.9,98.1,159.3,110.1z"/>
				<path onClick={this.onChartClick.bind(this, '10')} id="_x32_9868" className="st0" d="M191.6,68.9c10-4.5,40.2-6.8,40.2-6.8l3.8,24.5c-21.6,1.3-35.4,6.4-35.4,6.4L191.6,68.9z"/>
				<path onClick={this.onChartClick.bind(this, '11')} id="_x32_9869" className="st0" d="M269.3,86l-33.7,0.6l-3.8-24.5l37.5,0V86z"/>
				<path onClick={this.onChartClick.bind(this, '12')} id="_x32_9870" className="st0" d="M296.1,86.1h-26.8v-24h26.8V86.1z"/>
				<path onClick={this.onChartClick.bind(this, '13')} id="_x32_9871" className="st0" d="M327.2,86.1h-31.1v-24h31.1V86.1z"/>
				<path onClick={this.onChartClick.bind(this, '14')} id="_x32_9872" className="st0" d="M327.2,62.1h27.8v24h-27.8V62.1z"/>
				<path onClick={this.onChartClick.bind(this, '15')} id="_x32_9873" className="st0" d="M354.9,62.1h26.8v24h-26.8V62.1z"/>
				<path onClick={this.onChartClick.bind(this, '16')} id="_x32_9874" className="st0" d="M381.7,62.2h31.7v23.9h-31.7V62.2z"/>
				<path onClick={this.onChartClick.bind(this, '17')} id="_x32_9875" className="st0" d="M442.6,86.8c0,0-18.6-0.7-29.2-0.7V62.2c0,0,27.7-0.2,30.2,0L442.6,86.8z"/>
				<path onClick={this.onChartClick.bind(this, '18')} id="_x32_9876" className="st0" d="M442.6,86.8l1-24.6c42.8,3.5,54.8,10.7,54.8,10.7L490.2,97C468.3,88.2,442.6,86.8,442.6,86.8z"/>
				<path onClick={this.onChartClick.bind(this, '19')} id="_x32_9877" className="st0" d="M490.2,97l8.2-24.2c38.4,11.8,59.5,30.2,59.5,30.2l-15.1,23.2C521.4,108.3,490.2,97,490.2,97z"/>
				<path onClick={this.onChartClick.bind(this, '20')} id="_x32_9878" className="st0" d="M542.8,126.3l15.1-23.2c18.6,12.8,39.2,35.8,39.2,35.8L577,159C568,144.7,542.8,126.3,542.8,126.3z"/>
				<path onClick={this.onChartClick.bind(this, '21')} id="_x32_9879" className="st0" d="M577,159l20.1-20.1c26.1,26.8,42.9,71.5,42.9,71.5l-26.1,11.9C602.4,189.5,577,159,577,159z"/>
				<path onClick={this.onChartClick.bind(this, '22')} id="_x32_9880" className="st0" d="M640,210.4c14.3,33,16.4,77.4,16.4,77.4l-28.3,1.4c0,0-2.7-43.6-14.3-66.9L640,210.4z"/>
				<path onClick={this.onChartClick.bind(this, '23')} id="_x32_9881" className="st0" d="M628.2,289.2l28.3-1.4c2.7,31.4-1.1,74.7-1.1,74.7l-28.3-3.6C630.1,333.8,628.2,289.2,628.2,289.2z"/>
				<path onClick={this.onChartClick.bind(this, '24')} id="_x32_9882" className="st0" d="M627,358.9l28.3,3.6c-0.7,17.9-10.6,50.1-10.6,50.1l-27.1-10.1C622.9,387.4,627,358.9,627,358.9z"/>
				<path onClick={this.onChartClick.bind(this, '25')} id="_x32_9883" className="st0" d="M602.5,439.4c6.3-10.3,15.1-36.9,15.1-36.9l27.1,10.1c-7.5,23.7-18.7,41.2-18.7,41.2L602.5,439.4z"/>
				<path onClick={this.onChartClick.bind(this, '26')} id="_x32_9884" className="st0" d="M602.5,439.4l23.5,14.5c-13.5,29.7-42,57.4-42,57.4l-19.4-21.1C584.4,471.2,602.5,439.4,602.5,439.4z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 101')} id="_x32_9885" className="st0" d="M319.9,281.1h33v4.4h-33V281.1L319.9,281.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 102')} id="_x32_9886" className="st0" d="M286.4,281.1h30.9v4.4h-30.9V281.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 112')} id="_x32_9887" className="st0" d="M286.4,354.1h30.9v4.4h-30.9V354.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 113')} id="_x32_9888" className="st0" d="M319.9,354.1h33v4.4h-33V354.1L319.9,354.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 114')} id="_x32_9889" className="st0" d="M355.2,354.1h30.5v4.4h-30.5L355.2,354.1L355.2,354.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 124')} id="_x32_9890" className="st0" d="M355.2,281.1h30.5v4.4h-30.5L355.2,281.1L355.2,281.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 103')} id="_x32_9891" className="st0" d="M261.8,281.1h21.4v4.4h-21.4V281.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Risers 106')} id="_x32_9892" className="st0" d="M276.8,317.8h-30.9v-25.2h30.9V317.8z"/>
				<path onClick={this.onChartClick.bind(this, 'Risers 108')} id="_x32_9893" className="st0" d="M276.8,346.8h-30.9v-25.5h30.9V346.8z"/>
				<path onClick={this.onChartClick.bind(this, 'Lower Premium 111')} id="_x32_9894" className="st0" d="M261.8,354.1h21.4v4.4h-21.4V354.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Risers 120')} id="_x32_9895" className="st0" d="M394.6,292.6h30.9v25.2h-30.9V292.6z"/>
				<path onClick={this.onChartClick.bind(this, '101')} id="_x32_9896" className="st0" d="M320.2,192.4h32.6V279h-32.6L320.2,192.4L320.2,192.4z"/>
				<path onClick={this.onChartClick.bind(this, '102')} id="_x32_9897" className="st0" d="M286.4,192.4h30.9V279h-30.9V192.4z"/>
				<path onClick={this.onChartClick.bind(this, '112')} id="_x32_9898" className="st0" d="M286.4,360.3h30.9v86.6h-30.9V360.3z"/>
				<path onClick={this.onChartClick.bind(this, '113')} id="_x32_9899" className="st0" d="M320.2,360.3h32.6v86.6h-32.6L320.2,360.3L320.2,360.3z"/>
				<path onClick={this.onChartClick.bind(this, '114')} id="_x32_9900" className="st0" d="M355.3,360.3h29.2v86.6h-29.2V360.3z"/>
				<path onClick={this.onChartClick.bind(this, '124')} id="_x32_9901" className="st0" d="M355.3,192.4h29.2V279h-29.2V192.4z"/>
				<path onClick={this.onChartClick.bind(this, '103')} id="_x32_9902" className="st0" d="M263.8,279l-25.3-84.3c3.7-3.7,45.7-2.3,45.7-2.3V279H263.8z"/>
				<path onClick={this.onChartClick.bind(this, '104')} id="_x32_9903" className="st0" d="M260.7,279c0,0-6.5,0.8-9.5,2.9l-54.1-64.2c0,0,12.7-15.7,38.5-22.7L260.7,279z"/>
				<path onClick={this.onChartClick.bind(this, '105')} id="_x32_9904" className="st0" d="M164.2,254.2c7.2-18,30.4-39.7,30.4-39.7l56.7,67.5c-4.5,1.9-6.9,5.2-6.9,5.2L164.2,254.2z"/>
				<path onClick={this.onChartClick.bind(this, '109')} id="_x32_9905" className="st0" d="M198.6,428.9c-12.7-7.7-32.7-38.7-32.7-38.7l75.8-41.8c3.3,6.9,9.6,9.1,9.6,9.1L198.6,428.9z"/>
				<path onClick={this.onChartClick.bind(this, '110')} id="_x32_9906" className="st0" d="M238.7,444.4c0,0-24.7-5.9-37.4-19l50.2-67.9c0,0,1.5,2.5,10,2.5L238.7,444.4z"/>
				<path onClick={this.onChartClick.bind(this, '111')} id="_x32_9907" className="st0" d="M241.9,445.4l22.2-85.1h20.4v86.6C268.7,447.9,241.9,445.4,241.9,445.4z"/>
				<path onClick={this.onChartClick.bind(this, '115')} id="_x32_9908" className="st0" d="M387.1,360.3H407l23.2,86.6h-43.1V360.3z"/>
				<path onClick={this.onChartClick.bind(this, '116')} id="_x32_9909" className="st0" d="M476.1,426.1c0,0-14.7,14.9-43,19.6L410,360.3h9.3l7.8,12.4c0,0,7.2-2.9,8.7-5.2L476.1,426.1z"/>
				<path onClick={this.onChartClick.bind(this, '117')} id="_x32_9910" className="st0" d="M511.1,381.2c0,0-11.9,26.1-29.2,41.5L468.5,403l-5,4.6l-35.8-52.1c0,0,5.4-3.6,7.3-10.6L511.1,381.2z"/>
				<path onClick={this.onChartClick.bind(this, '121')} id="_x32_9911" className="st0" d="M505.9,250.4l-51,28.6c0,0-2.3-5.1-4.1-6l-20.7,14.2c0,0-2.1-2.8-5.6-4.9l50-69.7C474.5,212.5,495.9,229.1,505.9,250.4z"/>
				<path onClick={this.onChartClick.bind(this, '122')} id="_x32_9912" className="st0" d="M424.5,282.2l-3.1-1.8l17-29.7c0,0-10.3-6-17-8l10.9-43c0,0,23.1,3.2,39,17.1L424.5,282.2z"/>
				<path onClick={this.onChartClick.bind(this, '123')} id="_x32_9913" className="st0" d="M387.1,192.4h44.4L408.8,279h-21.7V192.4z"/>
				<path onClick={this.onChartClick.bind(this, '106')} id="_x32_9914" className="st0" d="M151.3,296.5c0.8-17.3,11.8-39.7,11.8-39.7l79.7,32.5c-4.7,6.7-3.4,16.9-3.4,16.9L151.3,296.5z"/>
				<path onClick={this.onChartClick.bind(this, '107')} id="_x32_9915" className="st0" d="M150.5,337.5c-2.1-15,0.8-38.1,0.8-38.1l87.2,9.5v20.6L150.5,337.5z"/>
				<path onClick={this.onChartClick.bind(this, '108')} id="_x32_9916" className="st0" d="M165,387.8c-11.9-21.1-13.7-48-13.7-48l87.2-7.3c0,7.5,2.4,13.7,2.4,13.7L165,387.8z"/>
				<path onClick={this.onChartClick.bind(this, '118')} id="_x32_9917" className="st0" d="M435.5,342.7c0.9-3.5,0-14.9,0-14.9l87.2,8.3c-1.8,23-10.6,42.5-10.6,42.5L435.5,342.7z"/>
				<path onClick={this.onChartClick.bind(this, '119')} id="_x32_9918" className="st0" d="M435.5,325.3v-15.6l85.6-14.4c3.6,15.5,1.6,37.8,1.6,37.8L435.5,325.3z"/>
				<path onClick={this.onChartClick.bind(this, '120')} id="_x32_9919" className="st0" d="M521.4,293.4l-85.9,14c0,0,0.2-9.5-1.5-14.7l73.7-39.1C507.7,253.5,517.5,269.5,521.4,293.4z"/>
				<path onClick={this.onChartClick.bind(this, '201')} id="_x32_9920" className="st0" d="M354.1,137.8h-35.5V88.7h35.5V137.8z"/>
				<path onClick={this.onChartClick.bind(this, '202')} id="_x32_9921" className="st0" d="M313.2,137.8h-45.8V88.7h45.8V137.8z"/>
				<path onClick={this.onChartClick.bind(this, '203')} id="_x32_9922" className="st0" d="M262.3,137.7c0,0-30.9,1.5-41.8,6.7l-7.7-51.1c0,0,16.8-4.6,49.5-4.6V137.7z"/>
				<path onClick={this.onChartClick.bind(this, '211')} id="_x32_9923" className="st0" d="M253.8,547.2c0,0-38.1-1-54.2-7.7l12.7-51.8c0,0,22.5,10.5,41.6,10.5V547.2z"/>
				<path onClick={this.onChartClick.bind(this, '212')} id="_x32_9924" className="st0" d="M256.9,498.2h43.4v49h-43.4L256.9,498.2L256.9,498.2z"/>
				<path onClick={this.onChartClick.bind(this, '213')} id="_x32_9925" className="st0" d="M305.2,498.2h46.7v49h-46.7V498.2z"/>
				<path onClick={this.onChartClick.bind(this, '214')} id="_x32_9926" className="st0" d="M415.5,547.1h-59v-49h59V547.1z"/>
				<path onClick={this.onChartClick.bind(this, '215')} id="_x32_9927" className="st0" d="M418.6,498.1c19.1,0,41.6-10.5,41.6-10.5l12.7,51.8c-16.2,6.7-54.2,7.7-54.2,7.7V498.1z"/>
				<path onClick={this.onChartClick.bind(this, '223')} id="_x32_9928" className="st0" d="M410.1,88.7c32.7,0,49.5,4.6,49.5,4.6l-7.7,51.1c-10.9-5.2-41.8-6.7-41.8-6.7V88.7z"/>
				<path onClick={this.onChartClick.bind(this, '224')} id="_x32_9929" className="st0" d="M359.1,88.7h45.8v49.1h-45.8V88.7z"/>
				<path onClick={this.onChartClick.bind(this, '204')} id="_x32_9930" className="st0" d="M215.6,145.9c0,0-22.2,8.7-27.6,12.6l-22-48.7c0,0,20.3-10.8,42.5-15.7L215.6,145.9z"/>
				<path onClick={this.onChartClick.bind(this, '204A')} id="_x32_9931" className="st0" d="M183.6,160.4c0,0-17.4,13.1-22.4,18.1l-35.3-41.4c0,0,18.8-16.4,35.3-24.7L183.6,160.4z"/>
				<path onClick={this.onChartClick.bind(this, '205')} id="_x32_9932" className="st0" d="M138.5,205.6l-46.7-31.8c0,0,15.8-22.7,30.1-33.3l35.3,42C157.1,182.5,144.9,196.4,138.5,205.6z"/>
				<path onClick={this.onChartClick.bind(this, '205A')} id="_x32_9933" className="st0" d="M122.8,234.7l-53.4-21.2c0,0,10.9-22.8,19.6-35l46,31C135.1,209.5,126.1,225.5,122.8,234.7z"/>
				<path onClick={this.onChartClick.bind(this, '209')} id="_x32_9934" className="st0" d="M83.8,449.5c0,0-13.2-21.9-19.4-40.9l54.7-17.3c0,0,7.4,18.4,13.3,28L83.8,449.5z"/>
				<path onClick={this.onChartClick.bind(this, '209A')} id="_x32_9935" className="st0" d="M114,487.7c0,0-21.2-21.6-27.6-33.9l48-30.3c0,0,9.6,13.4,17.3,23.5L114,487.7z"/>
				<path onClick={this.onChartClick.bind(this, '210')} id="_x32_9936" className="st0" d="M150.2,517.4c0,0-22.7-14.4-32.3-25.8l37.6-40.5c0,0,13.7,13,23.2,20L150.2,517.4z"/>
				<path onClick={this.onChartClick.bind(this, '210A')} id="_x32_9937" className="st0" d="M195.2,537.8c0,0-19.7-5.1-40.5-18.1l27.7-46.5c0,0,18.4,11.1,25.3,13.3L195.2,537.8z"/>
				<path onClick={this.onChartClick.bind(this, '216')} id="_x32_9938" className="st0" d="M464.7,486.5c7-2.2,25.3-13.3,25.3-13.3l27.7,46.5c-20.8,13-40.5,18.1-40.5,18.1L464.7,486.5z"/>
				<path onClick={this.onChartClick.bind(this, '216A')} id="_x32_9939" className="st0" d="M493.7,471.1c9.5-7.1,23.2-20,23.2-20l37.6,40.5c-9.6,11.4-32.3,25.8-32.3,25.8L493.7,471.1z"/>
				<path onClick={this.onChartClick.bind(this, '217')} id="_x32_9940" className="st0" d="M520.6,447c7.7-10.1,17.3-23.5,17.3-23.5l48,30.3c-6.4,12.3-27.6,33.9-27.6,33.9L520.6,447z"/>
				<path onClick={this.onChartClick.bind(this, '217A')} id="_x32_9941" className="st0" d="M540,419.3c5.9-9.6,13.3-28,13.3-28l54.7,17.3c-6.2,19-19.4,40.9-19.4,40.9L540,419.3z"/>
				<path onClick={this.onChartClick.bind(this, '221')} id="_x32_9942" className="st0" d="M537.3,209.5l46-31c8.7,12.2,19.6,35,19.6,35l-53.4,21.2C546.3,225.5,537.3,209.5,537.3,209.5z"/>
				<path onClick={this.onChartClick.bind(this, '221A')} id="_x32_9943" className="st0" d="M515.2,182.4l35.3-42c14.2,10.6,30.1,33.3,30.1,33.3l-46.7,31.8C527.5,196.3,515.2,182.4,515.2,182.4z"/>
				<path onClick={this.onChartClick.bind(this, '222')} id="_x32_9944" className="st0" d="M511.2,112.3c16.5,8.3,35.3,24.7,35.3,24.7l-35.3,41.4c-5-5-22.4-18.1-22.4-18.1L511.2,112.3z"/>
				<path onClick={this.onChartClick.bind(this, '222A')} id="_x32_9945" className="st0" d="M464,94c22.2,4.9,42.5,15.7,42.5,15.7l-22,48.7c-5.4-3.9-27.6-12.6-27.6-12.6L464,94z"/>
				<path onClick={this.onChartClick.bind(this, '206')} id="_x32_9946" className="st0" d="M114.1,263.9l-58.8-5c0,0,5.2-24.1,12.8-41.3l52.8,22C121,239.7,115.8,254.3,114.1,263.9z"/>
				<path onClick={this.onChartClick.bind(this, '207')} id="_x32_9947" className="st0" d="M111.1,308.4H51.4c0,0-0.4-25.8,3.5-44l57.9,5C112.8,269.4,111.1,290,111.1,308.4z"/>
				<path onClick={this.onChartClick.bind(this, '207A')} id="_x32_9948" className="st0" d="M111.1,352.8l-58,5.1c0,0-2.4-24.7-1.5-44.1h58.8C110.4,313.8,110.6,347.7,111.1,352.8z"/>
				<path onClick={this.onChartClick.bind(this, '208')} id="_x32_9949" className="st0" d="M117.8,386.3l-55.7,17.1c0,0-8-27.3-9-39.7l58.5-5.9C111.6,357.9,115.5,378.9,117.8,386.3z"/>
				<path onClick={this.onChartClick.bind(this, '218')} id="_x32_9950" className="st0" d="M560.8,357.8l58.5,5.9c-1,12.4-9,39.7-9,39.7l-55.7-17.1C556.9,378.8,560.8,357.8,560.8,357.8z"/>
				<path onClick={this.onChartClick.bind(this, '219')} id="_x32_9951" className="st0" d="M562,313.7h58.8c1,19.4-1.5,44.1-1.5,44.1l-58-5.1C561.8,347.7,562,313.7,562,313.7z"/>
				<path onClick={this.onChartClick.bind(this, '219A')} id="_x32_9952" className="st0" d="M559.6,269.4l57.9-5c3.9,18.2,3.5,44,3.5,44h-59.7C561.3,289.9,559.6,269.4,559.6,269.4z"/>
				<path onClick={this.onChartClick.bind(this, '220')} id="_x32_9953" className="st0" d="M551.4,239.6l52.8-22c7.6,17.2,12.8,41.3,12.8,41.3l-58.8,5C556.6,254.3,551.4,239.6,551.4,239.6z"/>
				<path onClick={this.onChartClick.bind(this, '215 Courtside')} id="_x32_9954" className="st0" d="M387.1,354.1h21.1v4.4h-21.1V354.1z"/>
				<path onClick={this.onChartClick.bind(this, '123 Courtside')} id="_x32_9955" className="st0" d="M387.1,281.1h21.1v4.4h-21.1V281.1z"/>
				<path onClick={this.onChartClick.bind(this, '227')} id="_x32_9956" className="st0" d="M382,292.6h3.6v54.2H382V292.6L382,292.6z"/>
				<path onClick={this.onChartClick.bind(this, '228')} id="_x32_9957" className="st0" d="M289.5,346.8h-3.6v-54.2h3.6V346.8z"/>
				<path onClick={this.onChartClick.bind(this, 'CC18')} id="_x32_9958" className="st0" d="M529.2,386.9l-14.4-6.8c7.4-17,11.3-44,11.3-44l13.1,1.2C536,371.4,529.2,386.9,529.2,386.9z"/>
				<path onClick={this.onChartClick.bind(this, 'CC19')} id="_x32_9959" className="st0" d="M539.7,334.9l-13.9-1.2c0,0,2.1-23.2-1.1-37.7l13.7-2.4C538.4,293.5,541.5,319.2,539.7,334.9z"/>
				<path onClick={this.onChartClick.bind(this, 'CC20')} id="_x32_9960" className="st0" d="M538.4,290.4l-14.5,2.2c0,0-4.2-23.9-12.9-41.1l15.2-8.3C526.1,243.2,534,258.6,538.4,290.4z"/>
				<path onClick={this.onChartClick.bind(this, 'CC21')} id="_x32_9961" className="st0" d="M509.5,248.8c0,0-13.4-24.7-29.6-36.3l10.8-17.5c0,0,17.1,13.2,34.3,45.2L509.5,248.8z"/>
				<path onClick={this.onChartClick.bind(this, '233')} id="_x32_9962" className="st0" d="M293.4,348.2h84.1v4.2h-84.1L293.4,348.2L293.4,348.2z"/>
				<path onClick={this.onChartClick.bind(this, '234')} id="_x32_9963" className="st0" d="M293.4,287.1h84.1v4.2h-84.1L293.4,287.1L293.4,287.1z"/>
				<path onClick={this.onChartClick.bind(this, 'Risers 118')} id="_x34_16740" className="st0" d="M394.6,347.4h30.9v-25.3h-30.9V347.4z"/>
				<path id="_x31_806524" className="st0" d="M417.7,580.3c0,0,108.5-6.1,166.3-69.1l-19.4-21.1c0,0-24.4,30.4-73.3,47.7c0,0-29.8,11-72.7,14.4H287.6v28.1H417.7z"/>
				<path id="_x31_806525" className="st0" d="M245.9,580.3h41.7v-28.1H247c0,0-86-1.2-135-62.1l-19.4,21.1C92.6,511.2,145.5,574.2,245.9,580.3z"/>
				<path onClick={this.onChartClick.bind(this, '238')} className="st1" d="M0,0h669v669H0V0z"/>
				<text transform="matrix(0.9387 0 0 1 143 148.7529)"><tspan x="0" y="0" className="st2 st3">204</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 184.9135 129.4963)" className="st2 st3">204</text>
				<text transform="matrix(0.9387 0 0 1 228.9326 118.5005)" className="st2 st3">203</text>
				<text transform="matrix(0.9387 0 0 1 281.5522 116.9772)" className="st2 st3">202</text>
				<text transform="matrix(0.9387 0 0 1 327.1511 116.9772)" className="st2 st3">201</text>
				<text transform="matrix(0.9387 0 0 1 373.2181 116.9772)" className="st2 st3">224</text>
				<text transform="matrix(0.9387 0 0 1 424.1941 117.9769)" className="st2 st3">223</text>
				<text transform="matrix(0.9387 0 0 1 466.5177 129.496)"><tspan x="0" y="0" className="st2 st3">222</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 112.8325 178.4297)" className="st2 st3">205</text>
				<text transform="matrix(0.9387 0 0 1 91.8169 211.0352)"><tspan x="0" y="0" className="st2 st3">205</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 77.3169 249.1457)" className="st2 st3">206</text>
				<text transform="matrix(0.9387 0 0 1 69.4957 291.3937)" className="st2 st3">207</text>
				<text transform="matrix(0.9387 0 0 1 69.4958 339.9843)"><tspan x="0" y="0" className="st2 st3">207</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 76.317 383.5318)" className="st2 st3">208</text>
				<text transform="matrix(0.9387 0 0 1 90.817 422.3555)" className="st2 st3">209</text>
				<text transform="matrix(0.9387 0 0 1 109.8325 458.0247)"><tspan x="0" y="0" className="st2 st3">209</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 139.4009 487.7162)" className="st2 st3">210</text>
				<text transform="matrix(0.9387 0 0 1 171.5912 509.4248)"><tspan x="0" y="0" className="st2 st3">210</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 219.5613 524.1457)" className="st2 st3">211</text>
				<text transform="matrix(0.9387 0 0 1 270.7412 529.1458)" className="st2 st3">212</text>
				<text transform="matrix(0.9387 0 0 1 317.7775 529.1453)" className="st2 st3">213</text>
				<text transform="matrix(0.9387 0 0 1 375.3107 530.1455)" className="st2 st3">214</text>
				<text transform="matrix(0.9387 0 0 1 430.8058 525.146)" className="st2 st3">215</text>
				<text transform="matrix(0.9387 0 0 1 477.6841 509.4252)" className="st2 st3">216</text>
				<text transform="matrix(0.9387 0 0 1 511.922 487.7165)"><tspan x="0" y="0" className="st2 st3">216</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 541.5904 457.0249)" className="st2 st3">217</text>
				<text transform="matrix(0.9387 0 0 1 561.5626 420.3555)"><tspan x="0" y="0" className="st2 st3">217</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 576.5777 383.7302)" className="st2 st3">218</text>
				<text transform="matrix(0.9387 0 0 1 581.1289 339.6653)" className="st2 st3">219</text>
				<text transform="matrix(0.9387 0 0 1 579.5775 293.8183)"><tspan x="0" y="0" className="st2 st3">219</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 574.0037 249.5726)" className="st2 st3">220</text>
				<text transform="matrix(0.9387 0 0 1 557.1852 214.4654)" className="st2 st3">221</text>
				<text transform="matrix(0.9387 0 0 1 532.6783 181.4527)"><tspan x="0" y="0" className="st2 st3">221</tspan><tspan x="19.7" y="0" className="st2 st4">A</tspan></text>
				<text transform="matrix(0.9387 0 0 1 504.1174 151.0662)" className="st2 st3">222</text>
				<text transform="matrix(1 0 0 1 194 256)" className="st2 st4">105</text>
				<text transform="matrix(1 0 0 1 221.7886 236.2105)" className="st2 st4">104</text>
				<text transform="matrix(1 0 0 1 258.8903 235.6635)" className="st2 st4">103</text>
				<text transform="matrix(1 0 0 1 293.3663 236.2105)" className="st2 st4">102</text>
				<text transform="matrix(1 0 0 1 324.909 236.6635)" className="st2 st4">101</text>
				<text transform="matrix(1 0 0 1 360.0981 236.2105)" className="st2 st4">124</text>
				<text transform="matrix(1 0 0 1 393.8926 236.7596)" className="st2 st4">123</text>
				<text transform="matrix(1 0 0 1 433.5235 229.6548)" className="st2 st4">122</text>
				<text transform="matrix(1 0 0 1 466.5177 250.806)" className="st2 st4">121</text>
				<text transform="matrix(1 0 0 1 476.0718 288.1469)" className="st2 st4">120</text>
				<text transform="matrix(1 0 0 1 476.0718 320.1595)" className="st2 st4">119</text>
				<text transform="matrix(1 0 0 1 475.8893 351.8256)" className="st2 st4">118</text>
				<text transform="matrix(1 0 0 1 462.5177 387.7301)" className="st2 st4">117</text>
				<text transform="matrix(1 0 0 1 429.8057 407.1935)" className="st2 st4">116</text>
				<text transform="matrix(1 0 0 1 391.8926 409.5826)" className="st2 st4">115</text>
				<text transform="matrix(1 0 0 1 360.0981 409.3177)" className="st2 st4">114</text>
				<text transform="matrix(1 0 0 1 327.1511 409.3177)" className="st2 st4">113</text>
				<text transform="matrix(1 0 0 1 291.8963 409.3177)" className="st2 st4">112</text>
				<text transform="matrix(1 0 0 1 258.8903 408.9949)" className="st2 st4">111</text>
				<text transform="matrix(1 0 0 1 225.6934 407.0855)" className="st2 st4">110</text>
				<text transform="matrix(1 0 0 1 197.5732 389.6563)" className="st2 st4">109</text>
				<text transform="matrix(1 0 0 1 178.9968 356.0721)" className="st2 st4">108</text>
				<text transform="matrix(1 0 0 1 178.0372 323.1619)" className="st2 st4">107</text>
				<text transform="matrix(1 0 0 1 177.9135 289.1614)" className="st2 st4">106</text>
				<text transform="matrix(0.7655 0 0 1 253.0308 309.501)" className="st2 st5">106</text>
				<text transform="matrix(0.7655 0 0 1 253.0303 338.6653)" className="st2 st5">108</text>
				<text transform="matrix(0.7655 0 0 1 402.3607 309.501)" className="st2 st5">120</text>
				<text transform="matrix(0.7655 0 0 1 401.6212 338.6653)" className="st2 st5">118</text>
				<text transform="matrix(1 0 0 1 345.7953 569)" className="st2 st4">PRESS BOX 1</text>
				<text transform="matrix(0.9153 0.4028 -0.4028 0.9153 140.1847 538.3187)" className="st2 st4">PRESS BOX 2</text>
				<text transform="matrix(0.9387 0 0 1 73.4952 478.4463)" className="st2 st3">1</text>
				<text transform="matrix(0.9387 0 0 1 47.375 432.408)" className="st2 st3">2</text>
				<text transform="matrix(0.9387 0 0 1 35.5297 388.73)" className="st2 st3">3</text>
				<text transform="matrix(0.9387 0 0 1 28.258 329.8091)" className="st2 st3">4</text>
				<text transform="matrix(0.9387 0 0 1 33.817 258)" className="st2 st3">5</text>
				<text transform="matrix(0.9387 0 0 1 54.5489 196.0289)" className="st2 st3">6</text>
				<text transform="matrix(0.9387 0 0 1 87.4472 150.5223)" className="st2 st3">7</text>
				<text transform="matrix(0.9387 0 0 1 127.3108 116.5001)" className="st2 st3">8</text>
				<text transform="matrix(0.9387 0 0 1 170.1722 92.1109)" className="st2 st3">9</text>
				<text transform="matrix(0.9387 0 0 1 203.2354 81.8067)" className="st2 st3">10</text>
				<text transform="matrix(0.9387 0 0 1 239.4874 78.0229)" className="st2 st3">11</text>
				<text transform="matrix(0.9387 0 0 1 271.7412 78.0227)" className="st2 st3">12</text>
				<text transform="matrix(0.9387 0 0 1 301.8598 78.6491)" className="st2 st3">13</text>
				<text transform="matrix(0.9387 0 0 1 586.9675 479.7311)" className="st2 st3">26</text>
				<text transform="matrix(0.9387 0 0 1 615.9038 431.9315)" className="st2 st3">25</text>
				<text transform="matrix(0.9387 0 0 1 628.9902 388.6561)" className="st2 st3">24</text>
				<text transform="matrix(0.9387 0 0 1 635.1641 331.1275)" className="st2 st3">23</text>
				<text transform="matrix(0.9387 0 0 1 630.0248 256.7676)" className="st2 st3">22</text>
				<text transform="matrix(0.9387 0 0 1 603.4707 188.1627)" className="st2 st3">21</text>
				<text transform="matrix(0.9387 0 0 1 562.1852 134.3473)" className="st2 st3">20</text>
				<text transform="matrix(0.9387 0 0 1 515.922 101.5623)" className="st2 st3">19</text>
				<text transform="matrix(0.9387 0 0 1 461.7732 81.9611)" className="st2 st3">18</text>
				<text transform="matrix(0.9387 0 0 1 418.5544 78.6491)" className="st2 st3">17</text>
				<text transform="matrix(0.9387 0 0 1 331.0956 78.9612)" className="st2 st3">14</text>
				<text transform="matrix(0.9387 0 0 1 386.0159 78.6489)" className="st2 st3">16</text>
				<text transform="matrix(0.9387 0 0 1 359.1189 78.6487)" className="st2 st3">15</text>
				<text transform="matrix(1 0 0 1 245.0606 183.3585)" className="st2 st4">CB3</text>
				<text transform="matrix(1 0 0 1 286.398 183.3585)" className="st2 st4">CB2</text>
				<text transform="matrix(1 0 0 1 324.0303 183.3585)" className="st2 st4">SB1</text>
				<text transform="matrix(1 0 0 1 357.9136 183.3585)" className="st2 st4">CB24</text>
				<text transform="matrix(1 0 0 1 398.5464 183.4524)" className="st2 st4">CB23</text>
				<text transform="matrix(1 0 0 1 197.0849 198.4589)" className="st2 st4">CB4</text>
				<text transform="matrix(1 0 0 1 447.2041 193.4157)" className="st2 st4">PS22</text>
				<text transform="matrix(0.8986 0.4387 -0.4387 0.8986 202.9966 445.2617)" className="st2 st4">CB10</text>
				<text transform="matrix(1 0 0 1 247.0606 463.2773)" className="st2 st4">CB11</text>
				<text transform="matrix(1 0 0 1 289.6418 463.7064)" className="st2 st4">CB12</text>
				<text transform="matrix(1 0 0 1 327.1511 463.7063)" className="st2 st4">SB13</text>
				<text transform="matrix(1 0 0 1 363.0981 463.7209)" className="st2 st4">CB14</text>
				<text transform="matrix(1 0 0 1 403.9203 463.7062)" className="st2 st4">CB15</text>
				<text transform="matrix(0.9096 -0.4154 0.4154 0.9096 450.831 456.3084)" className="st2 st4">CB16</text>
				<text transform="matrix(0.5624 -0.8268 0.8268 0.5624 502.636 421.7548)" className="st2 st6">CC17</text>
				<text transform="matrix(0.2518 -0.9678 0.9678 0.2518 529.4187 371.8775)" className="st2 st6">CC18</text>
				<text transform="matrix(4.100901e-02 0.9992 -0.9992 4.100901e-02 529.9918 303.0079)" className="st2 st6">CC19</text>
				<text transform="matrix(0.3016 0.9534 -0.9534 0.3016 519.0333 258.1091)" className="st2 st6">CC20</text>
				<text transform="matrix(0.6455 0.7638 -0.7638 0.6455 492.2619 214.4655)" className="st2 st6">CC21</text>
				<text transform="matrix(0.9387 0 0 1 334.3279 485.6669)" className="st2 st7">1</text>
				<text transform="matrix(0.9387 0 0 1 319.6281 485.6667)" className="st2 st7">2</text>
				<text transform="matrix(0.9387 0 0 1 349.8783 485.6667)" className="st2 st7">82</text>
				<text transform="matrix(0.9387 0 0 1 305.2701 485.6671)" className="st2 st7">3</text>
				<text transform="matrix(0.9387 0 0 1 292.1193 485.6673)" className="st2 st7">4</text>
				<text transform="matrix(0.9387 0 0 1 278.3801 485.6672)" className="st2 st7">5</text>
				<text transform="matrix(0.9387 0 0 1 263.232 485.6676)" className="st2 st7">6</text>
				<text transform="matrix(0.9355 7.786563e-02 -8.294721e-02 0.9966 248.8794 484.3397)" className="st2 st7">7</text>
				<text transform="matrix(0.9369 5.944946e-02 -6.332918e-02 0.998 233.1634 482.0369)" className="st2 st7">8</text>
				<text transform="matrix(0.9387 0 0 1 294.3664 155.0751)" className="st2 st7">40</text>
				<text transform="matrix(0.9387 0 0 1 309.2698 155.4216)" className="st2 st7">41</text>
				<text transform="matrix(0.9387 0 0 1 324.0305 155.0754)" className="st2 st7">42</text>
				<text transform="matrix(0.9387 0 0 1 337.341 155.2549)" className="st2 st7">43</text>
				<text transform="matrix(0.9387 0 0 1 352.8786 155.0754)" className="st2 st7">44</text>
				<text transform="matrix(0.9387 0 0 1 369.8866 155.0754)" className="st2 st7">45</text>
				<text transform="matrix(0.9387 0 0 1 386.8925 154.8414)" className="st2 st7">46</text>
				<text transform="matrix(0.9387 0 0 1 402.9205 155.0754)" className="st2 st7">47</text>
				<text transform="matrix(0.9387 0 0 1 278.5681 155.0754)" className="st2 st7">39</text>
				<text transform="matrix(0.9387 0 0 1 368.7357 485.6673)" className="st2 st7">81</text>
				<text transform="matrix(0.9387 0 0 1 386.8245 485.6674)" className="st2 st7">80</text>
				<text transform="matrix(0.9387 0 0 1 404.9442 485.6666)" className="st2 st7">79</text>
				<text transform="matrix(0.9386 -1.539491e-02 1.639960e-02 0.9999 421.7807 484.7303)" className="st2 st7">78</text>
				<text transform="matrix(0.9356 -7.656761e-02 8.156449e-02 0.9967 437.01 482.4855)" className="st2 st7">77</text>
				<text transform="matrix(0.9376 4.692528e-02 -4.998766e-02 0.9987 219.9216 478.2505)" className="st2 st7">9</text>
				<text transform="matrix(0.9387 5.303965e-03 -5.650107e-03 1 190.7666 465.2372)" className="st2 st7">11</text>
				<text transform="matrix(0.9386 1.548941e-02 -1.650027e-02 0.9999 203.5767 471.8845)" className="st2 st7">10</text>
				<text transform="matrix(0.9387 0 0 1 262.7413 155.255)" className="st2 st7">38</text>
				<text transform="matrix(0.9387 0 0 1 248.8795 156.0751)" className="st2 st7">37</text>
				<text transform="matrix(0.9319 -0.1132 0.1205 0.9927 234.2267 157.8419)" className="st2 st7">36</text>
				<text transform="matrix(0.9387 -1.038891e-03 1.106690e-03 1 218.5683 162.3714)" className="st2 st7">35</text>
				<text transform="matrix(0.9387 0 0 1 178.184 456.308)" className="st2 st7">12</text>
				<text transform="matrix(0.9387 0 0 1 165.9885 445.2614)" className="st2 st7">13</text>
				<text transform="matrix(0.9387 0 0 1 154.9021 433.4084)" className="st2 st7">14</text>
				<text transform="matrix(0.9387 0 0 1 145.3266 420.4033)" className="st2 st7">15</text>
				<text transform="matrix(0.9387 0 0 1 137.8557 407.3228)" className="st2 st7">16</text>
				<text transform="matrix(0.9387 0 0 1 130.8599 393.2618)" className="st2 st7">17</text>
				<text transform="matrix(0.9387 0 0 1 128.0488 380.6528)" className="st2 st7">18</text>
				<text transform="matrix(0.9387 0 0 1 204.9227 168.0248)" className="st2 st7">34</text>
				<text transform="matrix(0.9387 0 0 1 191.0128 175.6124)" className="st2 st7">33</text>
				<text transform="matrix(0.9387 0 0 1 178.1837 184.4521)" className="st2 st7">32</text>
				<text transform="matrix(0.9387 0 0 1 166.1318 195.0285)" className="st2 st7">31</text>
				<text transform="matrix(0.9387 0 0 1 156.822 205.645)" className="st2 st7">30</text>
				<text transform="matrix(0.9387 0 0 1 148.8188 217.6048)" className="st2 st7">29</text>
				<text transform="matrix(0.9387 0 0 1 138.6095 232.1322)" className="st2 st7">28</text>
				<text transform="matrix(0.9387 0 0 1 131.9 246.7641)" className="st2 st7">27</text>
				<text transform="matrix(0.9387 0 0 1 126.1976 261.8511)" className="st2 st7">26</text>
				<text transform="matrix(0.9387 0 0 1 123.9988 276.3617)" className="st2 st7">25</text>
				<text transform="matrix(0.9387 0 0 1 121.9911 293.7958)" className="st2 st7">24</text>
				<text transform="matrix(0.9387 0 0 1 121.3104 309.3266)" className="st2 st7">23</text>
				<text transform="matrix(0.9387 0 0 1 120.9914 322.6927)" className="st2 st7">22</text>
				<text transform="matrix(0.9387 0 0 1 121.9985 336.0514)" className="st2 st7">21</text>
				<text transform="matrix(0.9387 0 0 1 122.3101 350.8252)" className="st2 st7">20</text>
				<text transform="matrix(0.9387 0 0 1 123.3104 365.6739)" className="st2 st7">19</text>
				<text transform="matrix(0.9387 0 0 1 450.8307 477.9361)" className="st2 st7">76</text>
				<text transform="matrix(0.9387 0 0 1 466.5173 471.8842)" className="st2 st7">75</text>
				<text transform="matrix(0.9387 0 0 1 477.8889 465.1564)" className="st2 st7">74</text>
				<text transform="matrix(0.9387 0 0 1 419.4167 156.0743)" className="st2 st7">48</text>
				<text transform="matrix(0.9387 0 0 1 434.8054 157.8416)" className="st2 st7">49</text>
				<text transform="matrix(0.9387 0 0 1 450.2036 163.2778)" className="st2 st7">50</text>
				<text transform="matrix(0.9387 0 0 1 464.9037 168.0245)" className="st2 st7">51</text>
				<text transform="matrix(0.9387 0 0 1 477.6839 175.6121)" className="st2 st7">52</text>
				<text transform="matrix(0.9387 0 0 1 490.6859 184.3582)" className="st2 st7">53</text>
				<text transform="matrix(0.9387 0 0 1 501.1176 194.0285)" className="st2 st7">54</text>
				<text transform="matrix(0.9387 0 0 1 491.1795 455.5728)" className="st2 st7">73</text>
				<text transform="matrix(0.9387 0 0 1 503.118 445.931)" className="st2 st7">72</text>
				<text transform="matrix(0.9387 0 0 1 511.9224 434.3618)" className="st2 st7">71</text>
				<text transform="matrix(0.9387 0 0 1 512.1315 204.9106)" className="st2 st7">55</text>
				<text transform="matrix(0.9387 0 0 1 522.6361 420.755)" className="st2 st7">70</text>
				<text transform="matrix(0.9387 0 0 1 530.6787 408.5828)" className="st2 st7">69</text>
				<text transform="matrix(0.9387 0 0 1 521.6361 217.3311)" className="st2 st7">56</text>
				<text transform="matrix(0.9387 0 0 1 529.9922 231.186)" className="st2 st7">57</text>
				<text transform="matrix(0.9387 0 0 1 536.7694 246.7644)" className="st2 st7">58</text>
				<text transform="matrix(0.9387 0 0 1 542.0568 261.8513)" className="st2 st7">59</text>
				<text transform="matrix(0.9387 0 0 1 545.0376 276.362)" className="st2 st7">60</text>
				<text transform="matrix(0.9387 0 0 1 547.497 293.8185)" className="st2 st7">61</text>
				<text transform="matrix(0.9387 0 0 1 547.9121 308.3322)" className="st2 st7">62</text>
				<text transform="matrix(0.9387 0 0 1 548.0192 321.1598)" className="st2 st7">63</text>
				<text transform="matrix(0.9387 0 0 1 547.9126 334.8743)" className="st2 st7">64</text>
				<text transform="matrix(0.9387 0 0 1 537.321 394.7271)" className="st2 st7">68</text>
				<text transform="matrix(0.9387 0 0 1 542.0573 379.7481)" className="st2 st7">67</text>
				<text transform="matrix(0.9387 0 0 1 544.921 365.6741)" className="st2 st7">66</text>
				<text transform="matrix(0.9387 0 0 1 547.0192 350.3558)" className="st2 st7">65</text>
				<text transform="matrix(0.9387 0 0 1 175.0614 212.5047)" className="st2 st7">A</text>
				<text transform="matrix(0.9387 0 0 1 166.1725 223.1211)" className="st2 st7">B</text>
				<text transform="matrix(0.9387 0 0 1 157.8223 234.7521)" className="st2 st7">C</text>
				<text transform="matrix(0.9387 0 0 1 151.785 248.1457)" className="st2 st7">D</text>
				<text transform="matrix(0.9387 0 0 1 147.9344 259.3122)" className="st2 st7">E</text>
				<text transform="matrix(0.9387 0 0 1 144.9347 272.6101)" className="st2 st7">F</text>
				<text transform="matrix(0.9387 0 0 1 141.633 288.5619)" className="st2 st7">G</text>
				<text transform="matrix(0.9387 0 0 1 141.185 303.0074)" className="st2 st7">H</text>
				<text transform="matrix(0.9387 0 0 1 141.8564 317.8203)" className="st2 st7">I</text>
				<text transform="matrix(0.9387 0 0 1 141.1853 333.0512)" className="st2 st7">J</text>
				<text transform="matrix(0.9387 0 0 1 141.5297 347.395)" className="st2 st7">K</text>
				<text transform="matrix(0.9387 0 0 1 142.653 361.4953)" className="st2 st7">L</text>
				<text transform="matrix(0.9387 0 0 1 145.3473 376.2635)" className="st2 st7">M</text>
				<text transform="matrix(0.9387 0 0 1 149.7779 390.4799)" className="st2 st7">N</text>
				<text transform="matrix(0.9387 0 0 1 155.2094 402.0762)" className="st2 st7">O</text>
				<text transform="matrix(0.9387 0 0 1 163.0893 413.9449)" className="st2 st7">P</text>
				<text transform="matrix(0.9387 0 0 1 170.5753 424.8506)" className="st2 st7">Q</text>
				<text transform="matrix(0.9387 0 0 1 181.0375 435.4371)" className="st2 st7">R</text>
				<text transform="matrix(1.007 0 0 1 331.3857 290.6382)" className="st2 st8">WEST</text>
				<text transform="matrix(1.007 0 0 1 330.881 351.8248)" className="st2 st8">EAST</text>
				<text transform="matrix(1.007 0 0 1 268.5401 284.5131)" className="st2 st8">103</text>
				<text transform="matrix(1.007 0 0 1 296.5787 284.5126)" className="st2 st8">102</text>
				<text transform="matrix(1.007 0 0 1 328.5302 284.5126)" className="st2 st8">101</text>
				<text transform="matrix(1.007 0 0 1 364.311 284.5121)" className="st2 st8">124</text>
				<text transform="matrix(1.007 0 0 1 391.8729 284.5126)" className="st2 st8">123</text>
				<text transform="matrix(1.007 0 0 1 268.5401 357.5416)" className="st2 st8">111</text>
				<text transform="matrix(1.007 0 0 1 296.5787 357.5411)" className="st2 st8">112</text>
				<text transform="matrix(1.007 0 0 1 331.3857 357.5406)" className="st2 st8">113</text>
				<text transform="matrix(1.007 0 0 1 364.311 357.5416)" className="st2 st8">114</text>
				<text transform="matrix(1.007 0 0 1 393.8924 357.8201)" className="st2 st8">115</text>
				<text transform="matrix(9.667346e-03 1.007 -1 9.600105e-03 382.4238 313.1953)" className="st2 st8">NORTH</text>
				<text transform="matrix(-1.257806e-03 -1.007 1 -1.249057e-03 289.12 324.6925)" className="st2 st8">SOUTH</text>
			</svg>
			</div>
		);
	}
}
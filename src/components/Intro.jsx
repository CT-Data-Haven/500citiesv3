import React from 'react';
import { Message } from 'semantic-ui-react';

const Intro = () => {
	return (
		<div className="Intro">
			<Message size="small" compact>
				<p>
					The following data is from the 500 Cities Project of the CDC, CDC Foundation, and Robert Wood Johnson Foundation. The project makes available estimates of a variety of measures of public health at the census tract-level, allowing cities to better understand health issues locally.
				</p>
				<p>
					The map here displays city- and tract-level data for the 8 cities in Connecticut included in the project. More information on the 500 Cities Project is <a href="https://www.cdc.gov/500cities/">available from the CDC</a>. Data was updated by CDC in December 2017.
				</p>
				<p>
					Values for cities are shown in the chart at bottom. Choose a city to view its data by tract. Choose the tract summary view to see a histogram of all tract-level data.
				</p>
				<p>
					See how DataHaven used this data for an in-depth study on <a href="http://ctdatahaven.org/reports/merging-500-cities-and-connecticut-data-health-equity">health equity in Connecticut cities</a>.
				</p>
			</Message>
		</div>
	);
};

export default Intro;

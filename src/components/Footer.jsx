import React from 'react';
import { Segment } from 'semantic-ui-react';

const Footer = () => {
	return (
		<div className="Footer">
			<Segment basic secondary>
				<p>
					<strong>Source: </strong>Centers for Disease Control and Prevention. (2017). <a href="https://www.cdc.gov/500cities/">500 Cities Project.</a> Census tracts shown are the 2015 US Census Bureau <a href="https://www.census.gov/geo/maps-data/data/tiger.html">TIGER boundaries</a>.
				</p>
			</Segment>
		</div>
	);
}

export default Footer;

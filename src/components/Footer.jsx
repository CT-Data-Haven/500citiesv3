import React from 'react';
import { Segment, Image } from 'semantic-ui-react';

import src from '../img/25th-logotype.jpg';

const Footer = () => {
	return (
		<div className="Footer">
			<Segment basic secondary>
				<p>
					<strong>Source: </strong>Centers for Disease Control and Prevention. (2017). <a href="https://www.cdc.gov/500cities/">500 Cities Project.</a> Census tracts shown are the 2015 US Census Bureau <a href="https://www.census.gov/geo/maps-data/data/tiger.html">TIGER boundaries</a>.
				</p>
				<p>For more information on Connecticut's communities and cities, visit DataHaven's <a href="http://www.ctdatahaven.org/communities">Communities</a> page or <a href="http://www.ctdatahaven.org">main website</a>.</p>
				<Image src={src} size="small" as="a" href="http://www.ctdatahaven.org" target="_blank" />
			</Segment>
		</div>
	);
}

export default Footer;

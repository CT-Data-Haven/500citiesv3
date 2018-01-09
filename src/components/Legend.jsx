import React from 'react';
import { format } from 'd3-format';
import { LegendThreshold } from '@vx/legend';

import '../styles/Legend.css';

const Legend = (props) => {
	if (typeof props.colorscale === 'function') {
		return (
			<div className="Legend">
				<LegendThreshold
					scale={props.colorscale}
					labelFormat={(label) => label ? format('.2p')(label) : ''}
				/>
			</div>
		);
	} else {
		return <div></div>;
	}

};

export default Legend;

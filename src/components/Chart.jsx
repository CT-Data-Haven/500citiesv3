import React from 'react';
import * as _ from 'underscore';
import { ResponsiveORFrame } from 'semiotic';
import { scaleOrdinal } from 'd3-scale';
import { min, max, median } from 'd3-array';
import { format } from 'd3-format';

import '../styles/Chart.css';

const colors = scaleOrdinal()
	.domain(['normal', 'minmax', 'hovered', 'tract'])
	.range(['#4D91BF', '#4DBF9D', '#BF4D68', 'transparent']);

export default class Chart extends React.Component {
	getStyle = (d, i) => {
		return {
			fill: colors(d.fill),
			stroke: colors(d.fill),
			fillOpacity: d.id === this.props.city ? 1.0 : 0.6,
			strokeOpacity: 0.9,
			strokeWidth: d.id === this.props.city ? 5 : 0
		};
	};

	minMax() {
		if (this.props.data !== undefined && this.props.data.city !== undefined) {
			let byCity = this.props.data.city;
			byCity.forEach((d) => {
				d.fill = d.city === this.props.city || d.city === this.props.hovered ? 'hovered' : 'normal';
			});
			let byTract = _.pluck(this.props.data.tract, 'value');
			let minmax = [
				{ id: 'Tract min', value: min(byTract) },
				{ id: 'Tract median', value: median(byTract) },
				{ id: 'Tract max', value: max(byTract) }
			];
			minmax.forEach((d) => {
				d.measure = byCity[0].measure;
				d.fill = 'minmax';
			});
			return byCity.concat(minmax);
		} else {
			return [];
		}
	}

	flatData() {
		if (this.props.data !== undefined && this.props.data.city !== undefined) {
			let byCity = this.props.data.city;
			byCity.forEach((d) => {
				d.fill = d.city === this.props.city || d.city === this.props.hovered ? 'hovered' : 'normal';
			});
			let byTract = this.props.data.tract;
			byTract.forEach((d) => {
				d.fill = 'tract';
			});
			return byCity.concat(byTract);
		} else {
			return [];
		}
	}

	tooltip = (e) => {
		let d = e.d;
		if (d.fill === 'tract') {
			return false;
		} else {
			return (
				<div
					className="custom-tooltip"
					key={d.id}
					style={{
						position: 'absolute',
						top: d.y,
						left: d.x,
						minWidth: '80px',
						marginLeft: '-20px',
						marginTop: '-40px',
						textAlign: 'center'
					}}
				>{`${d.id}: ${format('.0%')(d.value)}`}</div>
			);
		}

	};

	hover = (e) => {
		console.log(this.state);
	};

	render() {
		let data = this.props.tractChart ? this.flatData() : this.minMax();
		// let height = this.props.tractChart ? 150 : 100;
		let height = 150;
		return (
			<div className="Chart">
				<ResponsiveORFrame
					size={[600, height]}
					responsiveWidth
					data={data}
					projection={'horizontal'}
					type={{ type: 'point', r: 9 }}
					pieceClass={(d) => `rect-${d.fill}`}
					summaryType={this.props.tractChart ? 'histogram' : null}
					oAccessor={'measure'}
					rAccessor={'value'}
					style={this.getStyle}
					summaryStyle={{ fill: '#aaa', fillOpacity: 0.6, stroke: '#fff', strokeOpacity: 0.9, strokeWidth: 1 }}
					margin={{ top: 30, right: 60, bottom: 50, left: 60 }}
					axis={{ tickFormat: d => format('.0%')(d), ticks: 5, padding: 6 }}
					pieceHoverAnnotation={true}
					htmlAnnotationRules={this.tooltip}
				/>
			</div>
		);
	}
}

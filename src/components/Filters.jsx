import React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import * as _ from 'underscore';

import '../styles/Filters.css';

export default class Filters extends React.Component {
	render() {
		let categories = _.chain(this.props.menus)
			.keys()
			.map((d) => ({ key: d, value: d, text: d }))
			.value();

		let measures = this.props.menus[this.props.category].map((d) => ({
			key: d.MeasureId, value: d.MeasureId, text: d.Short_Question_Text
		}));

		let cities = this.props.cities.map((d) => ({ key: d, value: d, text: d }));

		return (
			<div className="Filters">
				<Form>
					<Form.Select
						name="category"
						id="category-select"
						label="Category"
						value={this.props.category}
						options={categories}
						onChange={this.props.onChange}
						className="div5000"
					/>
					<Form.Select
						name="measure"
						id="measure-select"
						label="Measure"
						value={this.props.measure}
						options={measures}
						onChange={this.props.onChange}
						className="div5000"
					/>
					<Form.Select
						name="city"
						id="city-select"
						label="Zoom to city"
						value={this.props.city}
						options={cities}
						onChange={this.props.onCity}
						className="div4000"
					/>
					<Form.Field>
						<label>Chart</label>
						<Checkbox
							label="Show tract summary"
							name="tractChart"
							checked={this.props.tractChart}
							onChange={this.props.onToggle}
						/>
					</Form.Field>
				</Form>
			</div>
		);
	}
}

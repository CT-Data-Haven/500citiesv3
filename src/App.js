import React from 'react';
import * as _ from 'underscore';
import { Container, Grid, Header } from 'semantic-ui-react';
import { scaleThreshold } from 'd3-scale';
import { schemeYlGnBu } from 'd3-scale-chromatic';
import { ckmeans } from 'simple-statistics';

import { dataPrep } from './components/DataPrep';
import Filters from './components/Filters';
import StateMap from './components/StateMap';
import Chart from './components/Chart';
import Intro from './components/Intro';
import Footer from './components/Footer';

import './App.css';

const initData = dataPrep(require('./data/500all2017.json'));
const menus = _.groupBy(require('./data/menus.json'), 'Category');
const tractShp = require('./shapes/tracts_topo.json');
const coords = _.indexBy(require('./shapes/cities.json'), 'city');
// const box = [ 41.016397, -73.633975019844, 41.807568, -72.642536 ];
// const box = [[41.016397, -73.633975019844], [41.807568, -72.642536]];
// -73.23092965 41.35607564
const center = [41.4, -73.23092965];


class App extends React.Component {
	constructor() {
		super();

		let category = _.keys(menus)[0];
		let measure = menus[category][0].MeasureId;
		this.state = {
			data: initData,
			category: category,
			measure: measure,
			measureText: '',
			measureLong: '',
			colorscale: [],
			flatData: [],
			zoomed: false,
			city: '',
			hovered: '',
			center: center,
			// cityChart: true,
			tractChart: false
		};
	}

	componentDidMount() {
		let { category, measure } = this.state;
		let opts = { category, measure };
		this.update({ ...opts });
		this.setState({
			city: 'Show all'
		});
	}

	update(opts) {
		let { category, measure } = opts;
		let data = initData[measure];
		let item = _.where(menus[category], { MeasureId: measure })[0];
		this.setState({
			data,
			category,
			measure,
			measureText: item.Short_Question_Text,
			measureLong: item.Measure,
			colorscale: this.makeScale(data.tract),
			flatData: this.flatById(data)
		});
	}

	handleChange = (e, data) => {
		let { name, value } = data;
		let measure = name === 'category' ? menus[value][0].MeasureId : this.state.measure;
		let category = this.state.category;
		let opts = { category, measure };
		this.update({ ...opts, [name]: value });
	};

	handleToggle = (e, { name }) => {
		let val = this.state[name];
		this.setState({
			[name]: !val
		});
	};

	handleCity = (e, {value}) => {
		if (value === 'Show all') {
			this.setState({
				zoomed: false,
				center: center
			});
		} else {
			this.setState({
				zoomed: true,
				center: [coords[value].coordinates[1], coords[value].coordinates[0]]
			});
		}
		this.setState({
			city: value
		});
	};

	cityHover = (city) => {
		this.setState({
			hovered: city
		});
	};

	makeScale(data) {
		let vals = _.pluck(data, 'value').sort((a, b) => a - b);
		if (!vals.length) {
			return scaleThreshold().domain([0, 1]).range(['#ccc']);
		} else {
			let brks = ckmeans(vals, 5).map((d) => d[0]).slice(1);
			return scaleThreshold()
				.domain(brks)
				.range(schemeYlGnBu[5]);
		}
	}

	flatById(data) {
		let city = data.city;
		let tract = data.tract;
		return _.indexBy(tract.concat(city), 'id');
	}

	getCityNames() {
		let cities = _.pluck(this.state.data.city, 'city').sort();
		cities.unshift('Show all');
		return cities;
	}

	render() {
		return (
			<div className="App">
				<Container>

					<Grid stackable>
						<Grid.Row>
							<Grid.Column>
								<Header as="h1">500 Cities Project: Connecticut</Header>
								<Intro />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={6}>
								<Filters
									menus={menus}
									category={this.state.category}
									measure={this.state.measure}
									city={this.state.city}
									tractChart={this.state.tractChart}
									cities={this.getCityNames()}
									onChange={this.handleChange}
									onToggle={this.handleToggle}
									onCity={this.handleCity}
								/>
							</Grid.Column>

							<Grid.Column width={10}>
								<Header attached="top" as="h3">
									<Header.Content>
										{this.state.measureText}
										<Header.Subheader>
											{this.state.measureLong}
										</Header.Subheader>
									</Header.Content>
								</Header>
								<StateMap
									tractShp={tractShp}
									data={this.state.flatData}
									cities={this.getCityNames()}
									colorscale={this.state.colorscale}
									onClick={this.handleCity}
									onCityHover={this.cityHover}
									zoomed={this.state.zoomed}
									city={this.state.city}
									center={this.state.center}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={16}>
								<Chart
									data={this.state.data}
									city={this.state.city}
									hovered={this.state.hovered}
									tractChart={this.state.tractChart}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Footer />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
}

export default App;

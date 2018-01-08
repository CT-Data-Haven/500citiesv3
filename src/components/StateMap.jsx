import React from 'react';
import * as _ from 'underscore';
import { Map, TileLayer, GeoJSON, LayersControl, Pane } from 'react-leaflet';
import { Container } from 'semantic-ui-react';
import { format } from 'd3-format';
import { feature, merge, bbox } from 'topojson';
// import Legend from './Legend';

import '../styles/StateMap.css';

const { Overlay } = LayersControl;

// const position = [41.500765, -72.757507];
// -73.633975019844 41.016397 -72.642536 41.807568


export default class StateMap extends React.Component {
	makeTractGeo() {
		return feature(this.props.tractShp, this.props.tractShp.objects.tracts);
	}

	makeCityGeo() {
		let cities = _.chain(this.props.cities)
			.map((city) => {
				let geo = merge(this.props.tractShp, this.props.tractShp.objects.tracts.geometries.filter((d) => d.properties.CityName === city));
				geo.CityName = city;
				return geo;
			})
			.value();
		return {
			features: cities,
			type: 'FeatureCollection'
		};
	}

	getStyle = (feature) => {
		let id = feature.properties.GEOID;
		let color = this.props.data[id] ? this.props.colorscale(this.props.data[id].value) : '#ccc';

		return {
			fillColor: color,
			color: '#eee',
			weight: 0.2,
			opacity: 1,
			fillOpacity: 0.7
		};
	};

	cityStyle = (feature) => {
		return {
			fillColor: 'white',
			fillOpacity: 0,
			weight: 0.7,
			color: '#333'
		};
	};

	/////////////////////

	onEachTract = (feature, layer) => {
		let id = feature.properties.GEOID;

		layer
			// .on('click', this.props.onClick)
			.on('mouseover', this.tractHiliteOn)
			.on('mouseout', this.tractHiliteOff);

		layer.bindTooltip(() => {
			let data = this.props.data[id];
			return format('.2p')(data.value);
		}, { direction: 'auto', offset: [0, -20], className: 'custom-tip' });
	};

	onEachCity = (feature, layer) => {
		let city = feature.CityName;

		layer
			.on('mouseover', this.cityHiliteOn)
			.on('mouseout', this.cityHiliteOff);

		layer.bindTooltip(() => {
			let data = this.props.data[city];
			return `${city}: ${format('.2p')(data.value)}`;
		}, { direction: 'auto', className: 'custom-tip' });
	};

	//////////////////////////

	tractHiliteOn = (e) => {
		if (this.props.zoomed) {
			e.target.setStyle({
				fillOpacity: 0.9,
				weight: 1.5,
				color: '#999'
			}).bringToFront();
		}
	};

	tractHiliteOff = (e) => {
		e.target.setStyle({
			fillOpacity: 0.7,
			weight: this.props.zoomed ? 0.6 : 0.2,
			color: '#eee'
		});
	};

	cityHiliteOn = (e) => {
		if (!this.props.zoomed) {
			e.target.setStyle({
				weight: 1.1
			}).bringToFront();
		}
	};

	cityHiliteOff = (e) => {
		e.target.setStyle({
			weight: 0.7
		});
	};

	////////////////////

	render() {
		let tractGeo = feature(this.props.tractShp, this.props.tractShp.objects.tracts);
		let cityGeo = this.makeCityGeo();

		// let bounds = box;
		return (
			<div className="StateMap">
				<Container>

					<Map center={this.props.center} zoom={this.props.zoomed ? 12 : 9} scrollWheelZoom={false} useFlyTo={true}>
						{/* <Map bounds={this.props.bounds} scrollWheelZoom={false}> */}
						<Pane>
							<LayersControl position="topleft">
								<TileLayer
									url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png"
									// url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}"
									attribution="&copy; <a href=http://www.openstreetmap.org/copyright>OpenStreetMap</a> &copy; <a href=http://cartodb.com/attributions>CartoDB</a>"
									// ext="png"
								/>

								<Overlay name="tracts" checked={true}>
									<GeoJSON
										data={tractGeo}
										key={(feature) => feature.properties.GEOID}
										style={this.getStyle}
										onEachFeature={this.onEachTract}
									/>
								</Overlay>

								<Overlay name="cities" checked={!this.props.zoomed}>
									<GeoJSON
										data={cityGeo}
										// key={(feature) => feature.properties}
										style={this.cityStyle}
										onEachFeature={this.onEachCity}
									/>
								</Overlay>

							</LayersControl>
						</Pane>


					</Map>
					{/* <Legend colorscale={this.props.colorscale} /> */}
				</Container>

			</div>
		)
	}
}

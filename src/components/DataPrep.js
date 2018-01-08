import { format } from 'd3-format';
import { nest } from 'd3-collection';
import * as _ from 'underscore';

export const dataPrep = (data) => {
	return nest()
		.key((d) => d.measure)
		.key((d) => d.level)
		.object(data);
};

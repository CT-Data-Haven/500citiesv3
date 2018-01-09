import { nest } from 'd3-collection';

export const dataPrep = (data) => {
	return nest()
		.key((d) => d.measure)
		.key((d) => d.level)
		.object(data);
};

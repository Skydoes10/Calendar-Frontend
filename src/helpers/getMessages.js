export const getMessages = () => {
	return {
		previous: '<',
		next: '>',
		noEventsInRange: 'No events in this range',
		showMore: (total) => `+ show more (${total})`,
	};
};

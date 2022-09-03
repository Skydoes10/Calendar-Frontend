export const events = [
    {
        id: '1',
        start: new Date('2022-07-01 13:00:00'),
        end: new Date('2022-07-01 15:00:00'),
        title: 'Event 1 title',
        notes: 'Event 1 notes',
    },
    {
        id: '2',
        start: new Date('2022-05-02 13:00:00'),
        end: new Date('2022-05-02 15:00:00'),
        title: 'Event 2 title',
        notes: 'Event 2 notes',
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null,
};

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] },
};
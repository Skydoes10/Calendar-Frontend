import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarStates';

describe('Tests in calendarSlice', () => {

	test('should return the default state', () => {
		const state = calendarSlice.getInitialState();
		expect(state).toEqual(initialState);
	});

    test('onSetActiveEvent should active an event', () => {
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );
    });
    
    test('onAddNewEvent should add a new event', () => {
        const newEvent = {
            id: '3',
            start: new Date('2022-06-01 13:00:00'),
            end: new Date('2022-06-01 15:00:00'),
            title: 'Event 3 title',
            notes: 'Event 3 notes',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual( [ ...events, newEvent ] );
    });

    test('onUpdateEvent should update an event', () => {
        const updatedEvent = {
            id: '1',
            start: new Date('2022-06-01 13:00:00'),
            end: new Date('2022-06-01 15:00:00'),
            title: 'Event 1 Updated title',
            notes: 'Event 1 Updated notes',
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );
    });

    test('onDeleteEvent should delete the active event', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.events ).not.toContain( events[0] );
        expect( state.activeEvent ).toBeNull();
    });
    
    test('onLoadEvents should load events', () => {
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.events ).toEqual( events );
        expect( state.isLoadingEvents ).toBeFalsy();
    });
    
    test('onLogoutCalendar should reset the state', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );
    });
});

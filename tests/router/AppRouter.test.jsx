import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Tests in <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks());

	test('should show the loading page and call checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render( <AppRouter /> );

        expect( screen.getByText('Loading...') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();
    });

    test('should show the login page if not authenticated', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render( 
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );
        
        expect( screen.getAllByText('Login') ).toBeTruthy();
        expect( container ).toMatchSnapshot();
    });

    test('should show the calendar page if authenticated', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render( 
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('CalendarPage') ).toBeTruthy();
    });
});

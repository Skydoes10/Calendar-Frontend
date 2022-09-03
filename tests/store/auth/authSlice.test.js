import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Tests in authSlice', () => {

    test('should return the initial state', () => {
        expect( authSlice.getInitialState() ).toEqual( initialState );
    });

    test('should do the login', () => {
        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined,
        });
    });

    test('should do the logout', () => {
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        });
    });

    test('should do the logout with an error message', () => {
        const errorMessage = 'Error message';
        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage,
        });
    });

    test('should clear the error message', () => {
        const errorMessage = 'Error message';
        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        const newState = authSlice.reducer( state, clearErrorMessage() );
        expect( newState.errorMessage ).toBeUndefined();
    });
});

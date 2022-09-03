import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import calendarApi from '../../src/api/calendarApi';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
};

describe('Tests in useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('should return default values', () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        expect( result.current ).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function)
        });
    });

    test('startLogin should login correctly', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });
        
        await act( async () => {
            await result.current.startLogin( testUserCredentials );
        });
        
        const { errorMessage, status, user } = result.current;
        
        expect( status ).toBe('authenticated');
        expect( user ).toEqual( { name: 'Test User', uid: '62d19a0df8630e47b0fab181' } );
        expect( errorMessage ).toBeUndefined();
        
        expect( localStorage.getItem('token') ).toEqual( expect.any( String ));
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any( String ));
    });
    
    test('startLogin should fail authentication', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        await act( async () => {
            await result.current.startLogin({ email: 'any@google.com', password: 'any' });
        });

        const { errorMessage, status, user } = result.current;
        
        expect( status ).toBe('not-authenticated');
        expect( user ).toEqual( {} );
        expect( errorMessage ).toBe('Invalid credentials');

        expect( localStorage.getItem('token') ).toBeNull();

        await waitFor( () => {
            expect( result.current.errorMessage ).toBeUndefined();
        });
    });

    test('startRegister should create an user correctly', async () => {
        const newUser = { email: 'any@google.com', password: 'any', name: 'Test User 2' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                name: 'Test User 2',
                uid: 'any-uid',
                token: 'any-token'
            }
        });

        await act( async () => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, status, user } = result.current;

        expect( status ).toBe('authenticated');
        expect( user ).toEqual( { name: 'Test User 2', uid: 'any-uid' } );
        expect( errorMessage ).toBeUndefined();

        spy.mockRestore();
    });

    test('startRegister should fail creating an user', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        await act( async () => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;

        expect( status ).toBe('not-authenticated');
        expect( user ).toEqual( {} );
        expect( errorMessage ).toBe('User already exists');
    });

    test('checkAuthToken should fail if there is not a token', async () => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect( status ).toBe('not-authenticated');
        expect( user ).toEqual( {} );
        expect( errorMessage ).toBeUndefined();
    });

    test('checkAuthToken should authenticate the user if there is a token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        await act( async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;

        expect( status ).toBe('authenticated');
        expect( user ).toEqual( { name: 'Test User', uid: '62d19a0df8630e47b0fab181' } );
        expect( errorMessage ).toBeUndefined();
    });
});
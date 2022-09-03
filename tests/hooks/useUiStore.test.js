import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useUiStore } from "../../src/hooks";
import { uiSlice } from "../../src/store";

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer,
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
};

describe('Tests in useUiStore', () => {
    
    test('should return default values', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        expect( result.current ).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function),
            openDateModal: expect.any(Function),
        });
    });

    test('openDateModal should change to true in isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        const { openDateModal } = result.current;

        act( () => {
            openDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeTruthy();
    });

    test('closeDateModal should change to false in isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{children}</Provider>
        });

        const { closeDateModal } = result.current;

        act( () => {
            closeDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();
    });
});

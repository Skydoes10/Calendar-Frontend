export const initialState = {
    status: 'checking',
    user: {},
    errorMessage: undefined,
};

export const authenticatedState = {
    status: 'authenticated',
    user: {
        uid: '123',
        displayName: 'Test User',
    },
    errorMessage: undefined,
};

export const notAuthenticatedState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined,
};
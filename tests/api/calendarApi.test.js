import calendarApi from '../../src/api/calendarApi';

describe('Tests in calendarApi', () => {
	
    test('should have the default configuration', () => {
        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );
	});

    // test('should have the x-token in the header of all requests', async () => {
    //     const token = 'token-test';
    //     localStorage.setItem('token', token);
    //     const res = await calendarApi.get('/auth');
        
    //     console.log(res);
    //     // expect( res.config.headers['x-token'] ).toBe( token );

    // });
});
  
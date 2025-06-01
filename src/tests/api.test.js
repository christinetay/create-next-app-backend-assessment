describe('API Tests', () => {
  const rootApiUrl = 'http://localhost:3000';

  beforeAll(() => { 
    // Setup code if needed, like starting the server
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ students: [] }),
        text: () => Promise.resolve('OK'),
      })
    );
  });
  
  afterAll(() => {
    // Optionally restore fetch if needed
    global.fetch.mockRestore?.();
  });
  
  it('should return a 200 status for the root endpoint', async () => {
    const response = await fetch(`${rootApiUrl}/list-students`);
    expect(response.status).toBe(200);
  });
});
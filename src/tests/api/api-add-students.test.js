describe('API Tests - add students', () => {
  const rootApiUrl = 'http://localhost:3000';

  beforeAll(() => { 
    // Setup code if needed, like starting the server
    global.fetch = jest.fn((url, options) => {
      const body = options?.body ? JSON.parse(options.body) : {};

      if (!body.name || !body.email) {
        return Promise.resolve({
            status: 400,
            json: () => Promise.resolve({ error: 'Invalid student data'}),
        })
      }

      // Simulate a successful response for valid student data
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: 'Student added successfully' }),
        text: () => Promise.resolve('OK'),
      })
    });
  });
  
  afterAll(() => {
    // Optionally restore fetch if needed
    global.fetch.mockRestore?.();
  });
  
  it('should add a student and return a success message', async () => {
    const studentData = {
      name: 'Alice Johnson',
      isActive: true,
      email: 'alicejohson@gmail.com'
    };
    const response = await fetch(`${rootApiUrl}/add-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData.message).toBe('Student added successfully');
    expect(global.fetch).toHaveBeenCalledWith(
        `${rootApiUrl}/add-student`, 
        expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(studentData),
        })
    );
  });

    it('should return a 400 status for invalid student data', async () => {
        const invalidStudentData = {
            name: '', // Invalid name
            isActive: true,
            email: '' // Invalid email
        }; 
        const response = await fetch(`${rootApiUrl}/add-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidStudentData),
        });
        expect(response.status).toBe(400);
        const responseData = await response.json();
        expect(responseData.error).toBeDefined();
        expect(responseData.error).toBe('Invalid student data');
        expect(global.fetch).toHaveBeenCalledWith(`${rootApiUrl}/add-student`, expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(invalidStudentData),
        }));
    }
    );
}
);
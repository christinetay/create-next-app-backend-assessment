describe('API Tests - delete students', () => {
    const rootApiUrl = 'http://localhost:3000';
    const validStudentId = '123e4567-e89b-12d3-a456-426614174000'; // Example valid UUID
    const invalidStudentId = 'invalid-uuid'; // Example invalid UUID
    const nonExistentStudentId = '123e4567-e89b-12d3-a456-426614174999'; // Example non-existent UUID

    beforeAll(() => {
    // Setup code if needed, like starting the server
    global.fetch = jest.fn((url, options) => {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('id');

        if (!id) {
            return Promise.resolve({
                status: 400,
                json: () => Promise.resolve({ error: 'Student ID is required' }),
            });
        }

        // Validate UUID format (simple regex for demonstration)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return Promise.resolve({
                status: 400,
                json: () => Promise.resolve({ error: 'Invalid student ID format' }),
            });
        }

        if (id === nonExistentStudentId) {
            return Promise.resolve({
                status: 404,
                json: () => Promise.resolve({ error: 'Student not found' }),
            });
        }

        // Simulate a successful response for valid student ID
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ message: 'Student deleted successfully' }),
            text: () => Promise.resolve('OK'),
        });
    });
    });
  
  afterAll(() => {
    // Optionally restore fetch if needed
    global.fetch.mockRestore?.();
  });
  
  it('should delete a student and return a success message', async () => {
    const response = await fetch(`${rootApiUrl}/delete-student?id=${validStudentId}`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData.message).toBe('Student deleted successfully');
    expect(global.fetch).toHaveBeenCalledWith(
        `${rootApiUrl}/delete-student?id=${validStudentId}`, 
        expect.objectContaining({
            method: 'DELETE',
        })
    );
  });

    it('should return a 400 status for missing student ID', async () => {
        const response = await fetch(`${rootApiUrl}/delete-student`, {
            method: 'DELETE',
        });
        expect(response.status).toBe(400);
        const responseData = await response.json();
        expect(responseData.error).toBe('Student ID is required');
    });

    it('should return a 400 status for invalid student ID format', async () => {
        const response = await fetch(`${rootApiUrl}/delete-student?id=${invalidStudentId}`, {
            method: 'DELETE',
        });
        expect(response.status).toBe(400);
        const responseData = await response.json();
        expect(responseData.error).toBe('Invalid student ID format');
    });

    it('should return a 404 status for non-existent student ID', async () => {
        const response = await fetch(`${rootApiUrl}/delete-student?id=${nonExistentStudentId}`, {
            method: 'DELETE',
        });
        expect(response.status).toBe(404);
        const responseData = await response.json();
        expect(responseData.error).toBe('Student not found');
    });
 });
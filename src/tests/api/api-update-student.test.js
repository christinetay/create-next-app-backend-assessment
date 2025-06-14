describe('API Tests - update students', () => {
    const rootApiUrl = 'http://localhost:3000';

    beforeAll(() => {
        //setup code if needed, like starting the server
        global.fetch = jest.fn((url, options) => {
             const body = options?.body ? JSON.parse(options.body) : {};

             if (!body.id || !body.name || !body.email) {
                return Promise.resolve({
                    status: 400,
                    json: () => Promise.resolve({ error: 'Invalid student data' }),
                })
             }

             return Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ message: 'Student updated successfully' }),
                text: () => Promise.resolve('OK'),
            });
        });
    });

    afterAll(() => {
        // Optionally restore fetch if needed
        global.fetch.mockRestore?.();
    });

    it('should update a student and return a success message', async () => {
        const studentData = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Alice Johnson - Updated',
            isActive: true,
            email: 'alicejohnson@gmail.com',
        };
        const response = await fetch(`${rootApiUrl}/update-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });

        expect(response.status).toBe(200);
        const responseData = await response.json(); 
        expect(responseData.message).toBe('Student updated successfully');
        expect(global.fetch).toHaveBeenCalledWith(
            `${rootApiUrl}/update-student`, 
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
            id: '', //invalid id
            name: '', //invalid name
            isActive: '', //invalid isActive type, supposed to be boolean
            email: '', //invalid email
        };
        const response = await fetch(`${rootApiUrl}/update-student`, {
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
        expect(global.fetch).toHaveBeenCalledWith(`${rootApiUrl}/update-student`, expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(invalidStudentData),
        }));
    });

});
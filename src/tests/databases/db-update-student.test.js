describe('Database Tests for update student (Mocked)', () => {
    jest.mock('mssql');
    const sql = require('mssql');

    beforeAll(async () => {
        sql.connect.mockResolvedValue();
        sql.close.mockResolvedValue();
    });

    afterAll(async () => {
        await sql.close();
    });

    it('should update a student', async () => {
        // Mock the SQL connection
        const sqlStatement = 'UPDATE Students SET name = @name, isActive = @isActive, email = @email WHERE id = @id'; // Mocked SQL statement

        // Mock the request and query method
        const mockRecordset = { rowsAffected: [1] }; // Simulating one row affected
        sql.Request.mockImplementation(() => ({
            query: jest.fn().mockResolvedValue(mockRecordset),
            input: jest.fn().mockReturnThis(), // Mock input method to allow chaining
        }));

        const request = new sql.Request();
        request.input('id', '123e4567-e89b-12d3-a456-426614174000'); // Example UUID
        request.input('name', 'Alice Johnson - Updated');
        request.input('isActive', true);
        request.input('email', 'alicejohnson@gmail.com');
        const result = await request.query(sqlStatement);
        expect(result.rowsAffected).toBeDefined();
        expect(result.rowsAffected[0]).toBe(1); // Expect one row to be affected
    });

    it('should not update a student when isActive is not boolean', async () => {
        // Mock the SQL connection
        const sqlStatement = 'UPDATE Students SET name = @name, isActive = @isActive, email = @email WHERE id = @id'; // Mocked SQL statement

        // // Mock the request and query method
        // const mockRecordset = { rowsAffected: [1] }; // Simulating one row affected
        // sql.Request.mockImplementation(() => ({
        //     query: jest.fn().mockResolvedValue(mockRecordset),
        //     input: jest.fn().mockReturnThis(), // Mock input method to allow chaining
        // }));

        // Enhanced test case to check for invalid isActive type
        sql.Request.mockImplementation(() => {
            let isActiveValue;
            return {
                input: function (key, value) {
                    if (key === 'isActive') {
                        isActiveValue = value;
                    }
                    return this; // Allow chaining
                },
                query: jest.fn().mockImplementation(() => {
                    if (typeof isActiveValue !== 'boolean') {
                        return Promise.resolve({ rowsAffected: [0]});
                    }
                    return Promise.resolve({ rowsAffected: [1]});
                }),
            };
        });

        const request = new sql.Request();
        request.input('id', '123e4567-e89b-12d3-a456-426614174000'); // Example UUID
        request.input('name', 'Alice Johnson - Updated');
        request.input('isActive', 'wrongType'); // Invalid type
        request.input('email', 'alicejohnson@gmail.com');
        const result = await request.query(sqlStatement);
        expect(result.rowsAffected).toBeDefined();
        expect(result.rowsAffected[0]).toBe(0); // Expect no rows to be affected due to invalid isActive type
    });
});
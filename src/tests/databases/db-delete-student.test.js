describe('Database Tests for delete students (Mocked)', () => {
  jest.mock('mssql');
  const sql = require('mssql');

  beforeAll(async () => {
    sql.connect.mockResolvedValue();
    sql.close.mockResolvedValue();
  });

  afterAll(async () => {
    await sql.close();
  });

  it('should delete a student', async () => {
    // Mock the SQL connection
    const sqlStatement = 'DELETE FROM Students WHERE id = @id'; // Mocked SQL statement

    // Mock the request and query method
    const mockRecordset = { rowsAffected: [1] }; // Simulating one row affected
    sql.Request.mockImplementation(() => ({
      query: jest.fn().mockResolvedValue(mockRecordset),
      input: jest.fn().mockReturnThis(), // Mock input method to allow chaining
    }));

    const request = new sql.Request();
    request.input('id', '123e4567-e89b-12d3-a456-426614174000');
    const result = await request.query(sqlStatement);   
    expect(result.rowsAffected).toBeDefined();
    expect(result.rowsAffected[0]).toBe(1); // Expect one row to be affected
  });
});
describe('Database Tests for add students (Mocked)', () => {
  jest.mock('mssql');
  const sql = require('mssql');

  beforeAll(async () => {
    sql.connect.mockResolvedValue();
    sql.close.mockResolvedValue();
  });

  afterAll(async () => {
    await sql.close();
  });

  it('should add a student', async () => {
    // Mock the SQL connection
    const sqlStatement = 'INSERT INTO Students (name, isActive, email) VALUES (@name, @isActive, @email)'; // Mocked SQL statement

    // Mock the request and query method
    const mockRecordset = { rowsAffected: [1] }; // Simulating one row affected
    sql.Request.mockImplementation(() => ({
      query: jest.fn().mockResolvedValue(mockRecordset),
      input: jest.fn().mockReturnThis(), // Mock input method to allow chaining
    }));

    const request = new sql.Request();
    request.input('name', 'Alice Johnson');
    request.input('isActive', true);
    request.input('email', 'alicejohnson@gmail.com');
    const result = await request.query(sqlStatement);   
    expect(result.rowsAffected).toBeDefined();
    expect(result.rowsAffected[0]).toBe(1); // Expect one row to be affected
  });
});
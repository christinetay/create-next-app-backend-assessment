describe('Database Tests for list students (Mocked)', () => {

  jest.mock('mssql');
  const sql = require('mssql');

  beforeAll(async () => {
    sql.connect.mockResolvedValue();
    sql.close.mockResolvedValue();
  });

  afterAll(async () => {
    await sql.close();
  });

  it('should list students', async () => {
    // Mock the SQL connection
    const sqlStatement = 'SELECT * FROM Students'; // Mocked SQL statement

    // Mock the request and query method
    const mockRecordset = [
      { id: 1, name: 'John Doe', isActive: true, email: 'johndoe@gmail.com'},
      { id: 2, name: 'Jane Smith', isActive: false, email: ''},
    ];
    sql.Request.mockImplementation(() => ({
      query: jest.fn().mockResolvedValue({ recordset: mockRecordset })
    }));

    const result = await new sql.Request().query(sqlStatement);
    expect(result.recordset).toBeDefined();
    expect(result.recordset.length).toBe(2);
    expect(result.recordset[0].name).toBe('John Doe');
    expect(result.recordset[1].name).toBe('Jane Smith');
  });
});

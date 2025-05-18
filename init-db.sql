IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'backend_nodejs')
BEGIN
    CREATE DATABASE backend_nodejs;
END
GO
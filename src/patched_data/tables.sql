-- Teacher table
CREATE TABLE Teacher (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE
);

-- Student table
CREATE TABLE Student (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    isActive BIT NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE
);

-- CommonStudents table
CREATE TABLE CommonStudents (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    teacherEmail NVARCHAR(255) NOT NULL,
    studentEmailList NVARCHAR(MAX) NOT NULL
);
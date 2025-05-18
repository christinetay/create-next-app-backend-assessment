-- Teacher table
INSERT INTO Teacher (id, name, email)
VALUES
  (NEWID(), 'Alice', 'alice@school.com'),
  (NEWID(), 'Bob', 'bob@school.com');

-- Student table
INSERT INTO Student (id, name, isActive, email)
VALUES
  (NEWID(), 'Charlie', 1, 'charlie@student.com'),
  (NEWID(), 'Diana', 1, 'diana@student.com');

-- CommonStudents table
INSERT INTO CommonStudents (id, teacherEmail, studentEmailList)
VALUES
  (NEWID(), 'alice@school.com', 'charlie@student.com,diana@student.com'),
  (NEWID(), 'bob@school.com', 'charlie@student.com');
INSERT INTO Student 
(id, name, isActive, email)
VALUES 
(NEWID(), @name, @isActive, @email);
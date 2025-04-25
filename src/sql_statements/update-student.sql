UPDATE Student
SET 
  [name] = @name, 
  [isActive] = @isActive, 
  [email] = @email
WHERE [id] = @id;
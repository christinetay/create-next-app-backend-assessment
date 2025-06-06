DECLARE @MESSAGE NVARCHAR(MAX) = '',
        @SELECTED_TEACHER_EMAIL NVARCHAR(200) = '',
        @SELECTED_STUDENT_EMAIL_LIST NVARCHAR(MAX) = '';

BEGIN TRY
  BEGIN TRANSACTION;

  SET @SELECTED_TEACHER_EMAIL = @teacher_email;
  SET @SELECTED_STUDENT_EMAIL_LIST = @students_email_list;

  -- PART 1: SAVE TEACHER IF NOT FOUND
  IF ((SELECT COUNT(*) FROM Teacher WHERE [email] = @SELECTED_TEACHER_EMAIL) = 0) 
  BEGIN
    SET @MESSAGE += '; TEACHER IS NOT FOUND';
    SET @MESSAGE += ' & CREATE NEW RECORD OF TEACHER';
    DECLARE @TEACHER_NAME VARCHAR(200) = SUBSTRING(@SELECTED_TEACHER_EMAIL, 0, CHARINDEX('@', @SELECTED_TEACHER_EMAIL));

    INSERT INTO Teacher 
      ([id], [name], [email])
    VALUES
      (NEWID(), LTRIM(@TEACHER_NAME), LTRIM(@SELECTED_TEACHER_EMAIL));
  END


  -- PART 2: SAVE STUDENT IF NOT FOUND
  IF(@SELECTED_STUDENT_EMAIL_LIST <> '') 
  BEGIN
    SET @MESSAGE += '; ADD STUDENTS IF NOT EXIST IN STUDENT DB';

    INSERT INTO Student
      ([id], [name], [isActive], [email])
    SELECT 
      NEWID(),
      LTRIM(SUBSTRING([value], 0, CHARINDEX('@', [value]))),
      1,
      LTRIM([value])
    FROM 
      STRING_SPLIT(@SELECTED_STUDENT_EMAIL_LIST, ',')
    WHERE 
      NOT EXISTS(
        SELECT [email] FROM STUDENT WHERE [email] = [value]
      );    
  END


  -- PART 3: UPDATE TEACHER AND STUDENT LIST IF FOUND
  --         ADD TEACHER AND STUDENT LIST IF NOT FOUND
  IF((SELECT COUNT(*) FROM CommonStudents WHERE teacherEmail = @SELECTED_TEACHER_EMAIL) > 0)
  BEGIN
    SET @MESSAGE += '; UPDATE TEACHER AND STUDENT_LIST IN DB OF COMMONSTUDENTS';
    DECLARE @NEW_STUDENT_EMAIL_LIST NVARCHAR(MAX)= '';

    ;WITH NewStudentEmailListDB AS (
      SELECT [value] 
      FROM STRING_SPLIT(@SELECTED_STUDENT_EMAIL_LIST, ',')
    ),
    oldStudentEmailListDB AS (
      SELECT [value]
      FROM STRING_SPLIT(
        (
          SELECT [studentEmailList] FROM CommonStudents
          WHERE [teacherEmail] = @SELECTED_TEACHER_EMAIL
        ), ','
      )
    )
    SELECT  @NEW_STUDENT_EMAIL_LIST += [value] + ','
    FROM (
        SELECT [value] FROM NewStudentEmailListDB
        UNION
        SELECT [value] FROM oldStudentEmailListDB
    ) AS combinedEmails;

    SET @NEW_STUDENT_EMAIL_LIST = LEFT(@NEW_STUDENT_EMAIL_LIST, LEN(@NEW_STUDENT_EMAIL_LIST) - 1);

    UPDATE 
      CommonStudents
    SET 
      [studentEmailList] = LTRIM(@NEW_STUDENT_EMAIL_LIST)
    WHERE 
      [teacherEmail] = @SELECTED_TEACHER_EMAIL;
  END
  ELSE
  BEGIN
    SET @MESSAGE += '; ADD TEACHER AND STUDENT_LIST IN DB OF COMMONSTUDENTS';

    INSERT INTO CommonStudents
      ([id], [teacherEmail], [studentEmailList])
    VALUES
      (NEWID(), LTRIM(@SELECTED_TEACHER_EMAIL), LTRIM(@SELECTED_STUDENT_EMAIL_LIST));    
  END

  COMMIT TRANSACTION;

END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
  SET @MESSAGE = 'AN ERROR OCCURRED: ' + ERROR_MESSAGE();
END CATCH


SELECT @MESSAGE AS [message];
DECLARE @MESSAGE NVARCHAR(MAX) = '',
        @SELECTED_TEACHER_EMAIL VARCHAR(200) = '',
        @SELECTED_NOTIFICATION NVARCHAR(MAX) = '',
        @STUDENT_LIST_OUTCOME NVARCHAR(MAX) = '';

BEGIN TRY
  BEGIN TRANSACTION;

  SET @SELECTED_TEACHER_EMAIL = @teacher_email;
  SET @SELECTED_NOTIFICATION = @notification;

  --GET STUDENT LIST FROM TEACHER EMAIL
  ;WITH STUDENT_EMAIL_FROM_TABLE AS
  (
	  SELECT 
		  [value] AS [studentEmail]
	  FROM
      STRING_SPLIT(
        (	SELECT[studentEmailList]
          FROM CommonStudents
          WHERE[teacherEmail] = @SELECTED_TEACHER_EMAIL )
          ,','
      )
  ),
  STUDENT_EMAIL_FROM_NOTIFICATION AS (
    SELECT 
      SUBSTRING([value], 2, LEN([value]) + 1) AS [studentEmail]
    FROM 
      STRING_SPLIT(@SELECTED_NOTIFICATION, ' ') 
    WHERE 
      LEFT([value],1) = '@'
  )
  SELECT 
	  [email] AS [recipients]
  FROM 
	  Student
  WHERE 
    [email] IN (
      SELECT * FROM STUDENT_EMAIL_FROM_TABLE
      UNION
      SELECT * FROM STUDENT_EMAIL_FROM_NOTIFICATION
    )
    AND [isActive] = 1;

---------------------------------------------------------
-- !!! NOTE: GOT ISSUE WHEN RENDER LIST OF RECIPIENTS
--------------------------------------------------------

    


  COMMIT TRANSACTION;

END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
  SET @MESSAGE = 'AN ERROR OCCURRED: ' + ERROR_MESSAGE();
END CATCH


SELECT @MESSAGE AS [message];
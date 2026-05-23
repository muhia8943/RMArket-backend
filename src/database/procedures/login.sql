CREATE PROCEDURE spLoginUser
    @email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        UserID,
        username,
        email,
        password,
        role
    FROM Users
    WHERE email = @email;
END

GO
UPDATE Users
SET role = 'admin'
WHERE UserID = 3;
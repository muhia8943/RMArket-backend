CREATE PROCEDURE spDeleteUser
    @UserID INT
AS
BEGIN
    DELETE FROM Users WHERE UserID = @UserID;
END
go

UPDATE Users
SET role = 'admin'
WHERE UserID = 11;
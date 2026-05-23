CREATE PROCEDURE spGetUserById
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        UserID,
        username,
        email,
        phonenumber,
        role,
        profile_picture,
        skills,
        bio,
        createdAt
    FROM Users
    WHERE UserID = @UserID;
END
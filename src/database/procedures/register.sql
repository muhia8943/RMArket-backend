CREATE PROCEDURE spRegisterUser
    @username NVARCHAR(100),
    @email NVARCHAR(150),
    @phonenumber BIGINT = NULL,
    @password NVARCHAR(255),
    @role NVARCHAR(50) = 'user',
    @profile_picture NVARCHAR(500) = NULL,
    @skills NVARCHAR(500) = NULL,
    @bio NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Prevent duplicate email
    IF EXISTS (SELECT 1 FROM Users WHERE email = @email)
    BEGIN
        RAISERROR ('Email already exists', 16, 1);
        RETURN;
    END

    INSERT INTO Users (
        username,
        email,
        phonenumber,
        password,
        role,
        profile_picture,
        skills,
        bio
    )
    VALUES (
        @username,
        @email,
        @phonenumber,
        @password,
        @role,
        @profile_picture,
        @skills,
        @bio
    );
END
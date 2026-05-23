CREATE PROCEDURE spGetOrderHistory
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Orders
    WHERE UserID = @UserID
    ORDER BY CreatedAt DESC;
END

GO
DROP PROCEDURE IF EXISTS spGetOrderHistory;
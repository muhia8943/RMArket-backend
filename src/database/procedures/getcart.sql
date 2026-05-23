CREATE PROCEDURE spGetCart
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        o.OrderID,
        o.Status,
        o.TotalAmount,
        i.ItemID,
        i.name,
        i.image,
        oi.Quantity,
        oi.Price,
        oi.SubTotal
    FROM Orders o
    JOIN OrderItems oi ON o.OrderID = oi.OrderID
    JOIN Items i ON oi.ItemID = i.ItemID
    WHERE o.UserID = @UserID
      AND o.Status = 'CART';
END
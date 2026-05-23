CREATE PROCEDURE spGetOrderDetails
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        o.OrderID,
        o.Status,
        o.TotalAmount,
        o.CreatedAt,
        i.name,
        i.image,
        oi.Quantity,
        oi.Price,
        oi.SubTotal
    FROM Orders o
    JOIN OrderItems oi ON o.OrderID = oi.OrderID
    JOIN Items i ON oi.ItemID = i.ItemID
    WHERE o.OrderID = @OrderID;
END
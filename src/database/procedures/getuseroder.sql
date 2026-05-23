CREATE PROCEDURE spGetUserOrders
    @UserID INT
AS
BEGIN

    SET NOCOUNT ON;

    SELECT

        o.OrderID,
        o.Status,
        o.PaymentMethod,
        o.PaymentStatus,
        o.TotalAmount,
        o.CreatedAt,

        oi.OrderItemID,
        oi.Quantity,

        i.ItemID,
        i.name,
        i.description,
        i.price,
        i.image

    FROM Orders o

    JOIN OrderItems oi
        ON o.OrderID = oi.OrderID

    JOIN Items i
        ON oi.ItemID = i.ItemID

    WHERE o.UserID = @UserID
      AND o.Status <> 'CART'

    ORDER BY o.CreatedAt DESC;

END
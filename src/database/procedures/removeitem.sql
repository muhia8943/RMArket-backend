CREATE PROCEDURE spRemoveFromCart
    @OrderID INT,
    @ItemID INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM OrderItems
    WHERE OrderID = @OrderID AND ItemID = @ItemID;

    -- Recalculate total
    UPDATE Orders
    SET TotalAmount = (
        SELECT ISNULL(SUM(SubTotal), 0)
        FROM OrderItems
        WHERE OrderID = @OrderID
    ),
    UpdatedAt = GETDATE()
    WHERE OrderID = @OrderID;
END
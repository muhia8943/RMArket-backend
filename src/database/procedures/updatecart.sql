CREATE PROCEDURE spUpdateCartItem
    @OrderID INT,
    @ItemID INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Price DECIMAL(10,2);

    SELECT @Price = Price
    FROM OrderItems
    WHERE OrderID = @OrderID AND ItemID = @ItemID;

    UPDATE OrderItems
    SET Quantity = @Quantity,
        SubTotal = @Quantity * @Price
    WHERE OrderID = @OrderID AND ItemID = @ItemID;

    -- Recalculate total
    UPDATE Orders
    SET TotalAmount = (
        SELECT SUM(SubTotal)
        FROM OrderItems
        WHERE OrderID = @OrderID
    ),
    UpdatedAt = GETDATE()
    WHERE OrderID = @OrderID;
END
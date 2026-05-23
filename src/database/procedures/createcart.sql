CREATE PROCEDURE spAddToCart
    @UserID INT,
    @ItemID INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID INT;
    DECLARE @Price DECIMAL(10,2);
    DECLARE @ExistingQuantity INT;

    -- Get item price
    SELECT @Price = price
    FROM Items
    WHERE ItemID = @ItemID;

    IF @Price IS NULL
    BEGIN
        RAISERROR('Item not found', 16, 1);
        RETURN;
    END

    -- Get existing cart
    SELECT @OrderID = OrderID
    FROM Orders
    WHERE UserID = @UserID AND Status = 'CART';

    -- Create cart if not exists
    IF @OrderID IS NULL
    BEGIN
        INSERT INTO Orders (UserID)
        VALUES (@UserID);

        SET @OrderID = SCOPE_IDENTITY();
    END

    -- Check if item already exists
    SELECT @ExistingQuantity = Quantity
    FROM OrderItems
    WHERE OrderID = @OrderID AND ItemID = @ItemID;

    IF @ExistingQuantity IS NOT NULL
    BEGIN
        UPDATE OrderItems
        SET Quantity = Quantity + @Quantity,
            SubTotal = (Quantity + @Quantity) * @Price
        WHERE OrderID = @OrderID AND ItemID = @ItemID;
    END
    ELSE
    BEGIN
        INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price, SubTotal)
        VALUES (@OrderID, @ItemID, @Quantity, @Price, @Price * @Quantity);
    END

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
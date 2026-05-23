CREATE PROCEDURE spUpdateItem
    @ItemID INT,
    @name NVARCHAR(150),
    @description NVARCHAR(MAX),
    @price DECIMAL(10,2),
    @stock_quantity INT,
    @category NVARCHAR(100),
    @image NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Items
    SET
        name = @name,
        description = @description,
        price = @price,
        stock_quantity = @stock_quantity,
        category = @category,
        image = @image,
        updatedAt = GETDATE()
    WHERE ItemID = @ItemID;
END
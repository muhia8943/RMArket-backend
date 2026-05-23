CREATE PROCEDURE spCreateItem
    @name NVARCHAR(150),
    @description NVARCHAR(MAX),
    @price DECIMAL(10,2),
    @stock_quantity INT,
    @category NVARCHAR(100),
    @image NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Items
    (name, description, price, stock_quantity, category, image)
    VALUES
    (@name, @description, @price, @stock_quantity, @category, @image);
END
CREATE OR ALTER PROCEDURE spCheckout

    @UserID INT,
    @PaymentMethod NVARCHAR(30)

AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @OrderID INT;
    DECLARE @TotalAmount DECIMAL(10,2);

    BEGIN TRANSACTION;

    BEGIN TRY

        -- ================= FIND ACTIVE CART =================

        SELECT
            @OrderID = OrderID,
            @TotalAmount = TotalAmount
        FROM Orders
        WHERE UserID = @UserID
          AND Status = 'CART';



        -- ================= NO CART =================

        IF @OrderID IS NULL
        BEGIN
            RAISERROR('No active cart found', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END



        -- ================= EMPTY CART =================

        IF NOT EXISTS (
            SELECT 1
            FROM OrderItems
            WHERE OrderID = @OrderID
        )
        BEGIN
            RAISERROR('Cart is empty', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END



        -- ================= STOCK CHECK =================

        IF EXISTS (
            SELECT 1
            FROM OrderItems oi
            JOIN Items i
                ON oi.ItemID = i.ItemID
            WHERE oi.OrderID = @OrderID
              AND oi.Quantity > i.stock_quantity
        )
        BEGIN
            RAISERROR('Not enough stock available', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END



        -- ================= MPESA =================

        IF @PaymentMethod = 'MPESA'
        BEGIN

            UPDATE Orders
            SET
                Status = 'PROCESSING',
                PaymentMethod = 'MPESA',
                PaymentStatus = 'PENDING',
                UpdatedAt = GETDATE()
            WHERE OrderID = @OrderID;

        END



        -- ================= PAY ON DELIVERY =================

        ELSE IF @PaymentMethod = 'PAY_ON_DELIVERY'
        BEGIN

            UPDATE Orders
            SET
                Status = 'PENDING',
                PaymentMethod = 'PAY_ON_DELIVERY',
                PaymentStatus = 'PENDING',
                UpdatedAt = GETDATE()
            WHERE OrderID = @OrderID;



            INSERT INTO Payments (
                OrderID,
                Method,
                Status,
                Amount
            )
            VALUES (
                @OrderID,
                'PAY_ON_DELIVERY',
                'PENDING',
                @TotalAmount
            );

        END



        ELSE
        BEGIN

            RAISERROR(
                'Invalid payment method',
                16,
                1
            );

            ROLLBACK TRANSACTION;

            RETURN;

        END



        COMMIT TRANSACTION;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        THROW;

    END CATCH

END
GO
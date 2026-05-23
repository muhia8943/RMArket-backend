CREATE OR ALTER PROCEDURE spConfirmMpesaPayment

    @OrderID INT,
    @MpesaReceiptNumber NVARCHAR(100)

AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY

        -- ================= REDUCE STOCK =================

        UPDATE i
        SET i.stock_quantity =
            i.stock_quantity - oi.Quantity
        FROM Items i
        JOIN OrderItems oi
            ON i.ItemID = oi.ItemID
        WHERE oi.OrderID = @OrderID;




        -- ================= MARK ORDER PAID =================

        UPDATE Orders
        SET
            Status = 'PAID',
            PaymentStatus = 'PAID',
            UpdatedAt = GETDATE()
        WHERE OrderID = @OrderID;




        -- ================= INSERT PAYMENT RECORD =================

        INSERT INTO Payments (
            OrderID,
            Method,
            Status,
            Amount,
            TransactionCode
        )
        SELECT
            OrderID,
            'MPESA',
            'PAID',
            TotalAmount,
            @MpesaReceiptNumber
        FROM Orders
        WHERE OrderID = @OrderID;




        COMMIT TRANSACTION;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        THROW;

    END CATCH

END
GO
CREATE TABLE Payments (

    PaymentID INT IDENTITY(1,1) PRIMARY KEY,

    OrderID INT NOT NULL,

    Method NVARCHAR(30),

    Status NVARCHAR(30),

    Amount DECIMAL(10,2),

    TransactionCode NVARCHAR(100),

    CreatedAt DATETIME2 DEFAULT GETDATE()

);
// src/controller/mpesa.controller.ts

import { Request, Response } from "express";
import { poolPromise } from "../config/sql.config";
import * as sql from "mssql";

export class MpesaController {

    async callback(
        req: Request,
        res: Response
    ) {

        try {

            console.log(
                JSON.stringify(
                    req.body,
                    null,
                    2
                )
            );



            /**
             * ================= CALLBACK =================
             */

            const callback =
                req.body.Body.stkCallback;



            /**
             * ================= FAILED =================
             */

            if (
                callback.ResultCode !== 0
            ) {

                console.log(
                    "PAYMENT FAILED"
                );

                return res.json({
                    ResultCode: 0,
                    ResultDesc: "Accepted"
                });
            }



            /**
             * ================= METADATA =================
             */

            const items =
                callback.CallbackMetadata.Item;



            const mpesaReceipt =

                items.find(
                    (i: any) =>
                        i.Name ===
                        "MpesaReceiptNumber"
                )?.Value;



            /**
             * ================= DATABASE =================
             */

            const pool =
                await poolPromise;



            /**
             * ================= GET ORDER =================
             */

            const orderResult =
                await pool.request()
                    .query(`
                        SELECT TOP 1 OrderID
                        FROM Orders
                        WHERE PaymentMethod = 'MPESA'
                          AND PaymentStatus = 'PENDING'
                        ORDER BY CreatedAt DESC
                    `);



            const orderId =
                orderResult.recordset[0]?.OrderID;



            if (!orderId) {

                console.log(
                    "NO PENDING ORDER"
                );

                return res.json({
                    ResultCode: 0,
                    ResultDesc: "Accepted"
                });
            }



            /**
             * ================= CONFIRM PAYMENT =================
             */

            await pool.request()

                .input(
                    "OrderID",
                    sql.Int,
                    orderId
                )

                .input(
                    "MpesaReceiptNumber",
                    sql.NVarChar,
                    mpesaReceipt
                )

                .execute(
                    "spConfirmMpesaPayment"
                );



            console.log(
                "PAYMENT SUCCESS"
            );



            return res.json({
                ResultCode: 0,
                ResultDesc: "Accepted"
            });

        } catch (error) {

            console.log(error);

            return res.json({
                ResultCode: 0,
                ResultDesc: "Accepted"
            });
        }
    }
}
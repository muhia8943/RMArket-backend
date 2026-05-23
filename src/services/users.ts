import { poolPromise } from "../config/sql.config";
import * as sql from 'mssql';
import bcrypt from 'bcrypt';
import { user } from "../interface/user.interface";
import jwt from 'jsonwebtoken';

export class authService{
    public async register(user: user): Promise<void>{
        console.log("user details collected are;", user);
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await pool.request()
        .input('username', sql.NVarChar, user.username)
        .input('email', sql.NVarChar, user.email)
        .input('phonenumber', sql.BigInt, user.phonenumber)
        .input('password', sql.NVarChar, hashedPassword)
        .input('role', sql.NVarChar, user.role ?? 'user') // default role
        .input('profile_picture', sql.NVarChar, user.profile_picture ?? null)
        .input('skills', sql.NVarChar, user.skills ?? null)
        .input('bio', sql.NVarChar, user.bio ?? null)
        .execute('spRegisterUser');

        
    }
      public async login(email: string, password: string): Promise<{ token: string, role: string, UserId: number }> {

        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .execute('spLoginUser');

        const dbUser = result.recordset[0];

        if (!dbUser) {
            throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(password, dbUser.password);

        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            {
                userID: dbUser.UserID,
                email: dbUser.email,
                role: dbUser.role
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return { token, role: dbUser.role, UserId: dbUser.UserID };
    }


    // ================= GET USER BY ID =================
    public async getUserById(userID: number): Promise<user | null> {

        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', sql.Int, userID)
            .execute('spGetUserById');

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    }
    public async getAllUsers(): Promise<user[]> {

        const pool = await poolPromise;
        const result = await pool.request()
            .execute('spGetAllUsers');

        return result.recordset;
    }
    public async deleteUser(userID: number): Promise<void> {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('UserID', sql.Int, userID)
        .execute('spDeleteUser'); // 👈 create this stored procedure

    if (result.rowsAffected[0] === 0) {
        throw new Error("User not found");
    }
}
}
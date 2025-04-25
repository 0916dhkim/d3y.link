import { Request, Response } from "express";
import pool from "../db/data_connect";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    try {
        const userQuery = "SELECT * FROM users WHERE email = $1;";
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const sessionToken = crypto.randomBytes(64).toString("hex");

        await pool.query(
            `INSERT INTO sessions (user_id, session_token)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET session_token = $2, created_at = NOW();`,
            [user.id, sessionToken]
        );

        res.cookie("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            //secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        res.status(400).json({ error: "No session token provided" });
        return;
    }

    try {
        await pool.query("DELETE FROM sessions WHERE session_token = $1;", [sessionToken]);
        res.clearCookie("session_token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const checkSession = async (req: Request, res: Response): Promise<void> => {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        const sessionQuery = `
            SELECT u.id, u.email, s.created_at
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.session_token = $1;
        `;
        const sessionResult = await pool.query(sessionQuery, [sessionToken]);

        if (sessionResult.rows.length === 0) {
            res.status(401).json({ error: "Session expired" });
            return;
        }

        res.status(200).json({ message: "Authenticated", user: sessionResult.rows[0] });
    } catch (error) {
        console.error("Session Check Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// export const register = async (req: Request, res: Response): Promise<void> => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         res.status(400).json({ error: "Email and password are required" });
//         return;
//     }

//     try {
//         const checkUser = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
//         if (checkUser.rows.length > 0) {
//             res.status(409).json({ error: "Email already exists" });
//             return;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const insertUser = await pool.query(
//             `INSERT INTO users (email, password, last_login)
//              VALUES ($1, $2, NOW())
//              RETURNING id, email;`,
//             [email, hashedPassword]
//         );

//         res.status(201).json({
//             message: "Admin user registered successfully",
//             user: insertUser.rows[0],
//         });
//     } catch (error) {
//         console.error("Register Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

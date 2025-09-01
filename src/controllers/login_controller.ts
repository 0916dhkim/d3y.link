import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db/drizzle";
import { sessionTable, userTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const userResult = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));
    const user = userResult[0];

    if (user == null) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const sessionToken = crypto.randomBytes(64).toString("hex");

    await db.insert(sessionTable).values({
      userId: user.id,
      sessionToken,
    });

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
    await db
      .delete(sessionTable)
      .where(eq(sessionTable.sessionToken, sessionToken));
    res.clearCookie("session_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const result = await db.query.sessionTable.findFirst({
      where: (sessionTable, { eq }) =>
        eq(sessionTable.sessionToken, sessionToken),
      columns: { createdAt: true },
      with: {
        user: {
          columns: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (result == null) {
      res.status(401).json({ error: "Session expired" });
      return;
    }

    res.status(200).json({
      message: "Authenticated",
      createdAt: result.createdAt,
      user: result.user,
    });
  } catch (error) {
    console.error("Session Check Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const result = await db
      .update(sessionTable)
      .set({
        createdAt: sql`NOW()`,
      })
      .where(eq(sessionTable.sessionToken, sessionToken))
      .returning({
        createdAt: sessionTable.createdAt,
      });
    const updated = result[0];

    if (updated == null) {
      res.status(401).json({ error: "Session not found" });
      return;
    }

    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Session refreshed",
      createdAt: updated.createdAt,
    });
  } catch (error) {
    console.error("Refresh Session Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

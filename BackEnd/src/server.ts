import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import linkRoutes from "./routes/links_routes";
import loginRoutes from "./routes/login_routes";

const app = express();

dotenv.config();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

app.use("/api/links", linkRoutes);

app.use("/api/auth", loginRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
});

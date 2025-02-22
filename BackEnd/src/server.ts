import express, { Request, Response } from "express";
import dotenv from "dotenv";
import linkRoutes from "./routes/links_routes";

const app = express();

dotenv.config();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

app.use("/api/links", linkRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
});

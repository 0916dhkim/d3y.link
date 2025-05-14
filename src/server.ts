import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import linkRoutes from "./links_routes";
import loginRoutes from "./login_routes";
import { integrateReactRouter } from "./react-router-express-integration";

const app = express();

dotenv.config();

const PORT = process.env.PORT || "8000";

app.use(express.json());

app.use(cookieParser());

app.use("/api/links", linkRoutes);

app.use("/api/auth", loginRoutes);

integrateReactRouter(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

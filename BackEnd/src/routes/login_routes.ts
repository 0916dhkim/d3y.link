import express from "express";
import { login, logout, checkSession, register } from "../controllers/login_controller";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/session", checkSession);
router.post("/register", register);

export default router;

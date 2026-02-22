import express from "express";
import {
  login,
  logout,
  checkSession,
  refreshSession,
  register,
  hasUsers,
} from "./controllers/login_controller";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/session", checkSession);
router.post("/refresh", refreshSession);
router.post("/register", register);
router.get("/has-users", hasUsers);

export default router;

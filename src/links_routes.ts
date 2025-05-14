import express from "express";
import {
  getLinks,
  createLink,
  gotoLink,
  updateLink,
  deleteLink,
} from "./controllers/links_controller";

const router = express.Router();

router.get("/", getLinks);
router.post("/", createLink);

router.get("/:slug", gotoLink);
router.put("/:slug", updateLink);
router.delete("/:slug", deleteLink);

export default router;

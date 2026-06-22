import express from "express";

import { getMatches } from "../controllers/footballController.js";

const router = express.Router();

router.get("/matches", getMatches);
export default router;
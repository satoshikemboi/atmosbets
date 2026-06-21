import express from "express";

import {
  getLiveMatches,
  getFixtures,
} from "../controllers/footballController.js";

const router = express.Router();

router.get("/live", getLiveMatches);

router.get("/fixtures", getFixtures);

export default router;
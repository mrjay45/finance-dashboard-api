const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  dashboardController.getSummary,
);
router.get(
  "/category-summary/",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  dashboardController.getAllCategorySummary,
);
router.get(
  "/category-summary/:category",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  dashboardController.getCategorySummary,
);

router.get(
  "/trends",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  dashboardController.getTrends,
);

router.get(
  "/recent-records",
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  dashboardController.getRecentRecords,
);

module.exports = router;

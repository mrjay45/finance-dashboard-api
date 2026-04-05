const express = require("express");

const router = express.Router();

const recordController = require("../controllers/record.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware")

router.post("/record", authMiddleware, roleMiddleware('admin'), recordController.createRecord);
router.get("/record", authMiddleware, roleMiddleware('admin','analyst', 'viewer'), recordController.getRecords);
router.get("/record/:id", authMiddleware, roleMiddleware('admin','analyst', 'viewer'), recordController.getRecordById);
router.patch("/record/:id", authMiddleware, roleMiddleware('admin'), recordController.updateRecord);
router.delete("/record/:id", authMiddleware, roleMiddleware('admin'), recordController.deleteRecord);


module.exports = router;

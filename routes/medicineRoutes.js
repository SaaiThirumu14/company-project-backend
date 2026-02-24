const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", medicineController.getAllMedicines);
router.post("/add-stock", restrictTo("pharmacy", "super_admin"), medicineController.addStock);
router.get("/:id", medicineController.getMedicine);

module.exports = router;

const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/auth.routes");
const taskRoutes = require("./task/task.routes");

router.use("/auth", authRoutes);
router.use("/frontEnd", taskRoutes);

module.exports = router;
const express = require("express");
const router = express.Router();
const taskRoutes = require("./task/task.routes");

router.use("/frontEnd", taskRoutes);

module.exports = router;
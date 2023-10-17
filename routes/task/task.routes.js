const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/task/task.controller");
const authorized = require("../../middleware");



router.route("/allTasks").get(authorized, taskController.readAll);
router.route("/tasks").post(authorized, taskController.create);
router.route("/tasks").get(authorized,taskController.read);
router.route("/tasks/:id").put(authorized,taskController.update);
router.route("/tasks/:id").get(authorized,taskController.singleTask);
router.route("/tasks/:id").delete(authorized,taskController.delete);

module.exports = router;

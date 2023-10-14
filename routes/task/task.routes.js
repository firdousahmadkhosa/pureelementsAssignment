const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/task/task.controller");

router.route("/allTasks").get(taskController.readAll);
router.route("/tasks").post(taskController.create);
router.route("/tasks").get(taskController.read);
router.route("/tasks/:id").put(taskController.update);
router.route("/tasks/:id").get(taskController.singleTask);
router.route("/tasks/:id").delete(taskController.delete);

module.exports = router;

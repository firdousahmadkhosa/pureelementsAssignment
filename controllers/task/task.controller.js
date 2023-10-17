const db = require("../../models");
const Task = db.tasks;

/**
 * Create a new task into the tasks array
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.create = async (req, res, next) => {
  req.checkBody("title", "Task title is mandatory").notEmpty();
  req.checkBody("description", "Task description is madatory").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      message: "Missing fields or invalid data",
      errors,
    });
  }
  try {
    const { title, description } = req.body;
    const completed = req.body.completed ? req.body.completed : false;
    const newTask = await Task.create({ title, description, completed });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a list of tasks with pagination
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.read = async (req, res, next) => {
 try {
   const page = parseInt(req.query.page) || 1;
   const pageSize = parseInt(req.query.pageSize) || 10;

   const startIndex = (page - 1) * pageSize;
   const endIndex = startIndex + pageSize;

   const tasks = await Task.findAndCountAll({
     limit: pageSize,
     offset: startIndex,
   });

   res.json(tasks);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};

/**
 * Get a list of tasks
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.readAll = async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get details of a specific task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.singleTask = async (req, res, next) => {
  try {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const testValidUUID = uuidRegex.test(req.params.id);
    if (!testValidUUID) {
      return res.status(404).json({ error: "Task id must be valid!" });
    }
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
/**
 * Update details of a specific task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.update = async (req, res, next) => {
  req.checkBody("title", "Task title is mandatory").notEmpty();
  req.checkBody("description", "Task description is madatory").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      message: "Missing fields or invalid data",
      errors,
    });
  }
  try {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const testValidUUID = uuidRegex.test(req.params.id);
    if (!testValidUUID) {
      return res.status(404).json({ error: "Task id must be valid!" });
    }

    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, description } = req.body;
    const completed = req.body.completed ? req.body.completed : false;
    task.title = title;
    task.description = description;
    task.completed = completed || false;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a specific task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.delete = async (req, res, next) => {
  try {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const testValidUUID = uuidRegex.test(req.params.id);
    if (!testValidUUID) {
      return res.status(404).json({ error: "Task id must be valid!" });
    }
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
 res.status(200).send("task deleted successfuly");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }

};

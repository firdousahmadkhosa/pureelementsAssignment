
const tasks = [];

// Generate a unique task ID
function generateTaskId() {
  return (tasks.length + 1).toString();
};

// Task for input validation
function validateTask(task) {
  if (!task.title || !task.description || task.completed === undefined) {
    throw new Error("Task is missing required fields.");
  }
};



/**
 * Create a new task into the tasks array
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.create = async (req, res, next) => {
  try {
    const task = req.body;
    validateTask(task);
    task.id = generateTaskId();
    tasks.push(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the tasks array to get a subset of tasks based on pagination parameters
  const tasksSubset = tasks.slice(startIndex, endIndex);

  res.json(tasksSubset);
};



/**
 * Get a list of tasks with pagination
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.readAll = async (req, res, next) => {
  res.json(tasks);
};



/**
 * Get details of a specific task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.singleTask = async (req, res, next) => {
  const taskId = req.params.id;
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
};
;

/**
 * Update details of a specific task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
exports.update = async (req, res, next) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    try {
      const updatedTask = req.body;
      validateTask(updatedTask);
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      res.json(tasks[taskIndex]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Task not found" });
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
   const taskId = req.params.id;
   const taskIndex = tasks.findIndex((t) => t.id === taskId);

   if (taskIndex !== -1) {
     tasks.splice(taskIndex, 1);
     res.status(200).send("task deleted successfuly");
   } else {
     res.status(404).json({ error: "Task not found" });
   }
};
const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};

//1. Authenticated admin can create task and give task to staff
taskController.createTask = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { name, detail, assignee } = req.body;

  const receiver = await User.findById(assignee);

  if (!receiver) {
    throw new AppError(404, "User not found", "Task error");
  }

  const newTask = {};
  newTask.name = name;
  newTask.detail = detail;
  newTask.assigner = currentUserId;
  newTask.assignee = assignee;

  const task = await Task.create(newTask);

  return sendResponse(res, 200, true, task, null, "Create Task successful");
});

// 2. Authenticated admin can see a list of task.
taskController.getAllTasks = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const count = await Task.countDocuments();
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let tasksList = await Task.find()
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    { tasksList, totalPage },
    null,
    "Get all user successful"
  );
});

// 3. Authenticated admin can update task.
taskController.updateTask = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { taskId } = req.params;
  const { name, detail, assignee } = req.body;
  let task = await Task.findById({ _id: taskId });
  if (!task) {
    throw new AppError(404, "Task not found", "Update Task Error");
  }

  task.name = name;
  task.detail = detail;
  task.assignee = assignee;
  task = await task.save();

  return sendResponse(res, 200, true, task, null, "Update Task Successful");
});

// 4. Authenticated admin can delete task.
taskController.deleteTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  let task = await Task.findOneAndDelete({
    _id: taskId,
  });
  if (!task) {
    throw new AppError(404, "Task not found", "Update Task Error");
  }
  return sendResponse(res, 200, true, {}, null, "Delete Task Successful");
});

// 5. Staff can see list of assigned tasks✅
taskController.listOfTaskReceive = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const count = await Task.countDocuments({ assignee: currentUserId });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let tasksList = await Task.find({
    assignee: currentUserId,
    status: "todo",
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { tasksList, totalPage },
    null,
    "Get list of Task Successful"
  );
});

//6. Staff can change status task review
taskController.UpdateTaskToReviewByStaff = catchAsync(
  async (req, res, next) => {
    const { currentUserId } = req;
    const { taskId } = req.params;
    const { status } = req.body;

    let task = await Task.findOne({
      _id: taskId,
      assignee: currentUserId,
      status: "todo",
    });

    if (!task) {
      throw new AppError(400, "Task not found", "Update Task Error");
    }
    task.status = status;
    task = await task.save();
    return sendResponse(res, 200, true, task, null, "Update task successful");
  }
);

taskController.UpdateTaskReviewByAdmin = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { taskId } = req.params;
  const { status } = req.body;

  let task = await Task.findOne({
    _id: taskId,
    assigner: currentUserId,
    status: "review",
  });

  if (!task) {
    throw new AppError(400, "Task not found", "Update Task Error");
  }
  task.status = status;
  task = await task.save();
  return sendResponse(res, 200, true, task, null, "Update task successful");
});

module.exports = taskController;

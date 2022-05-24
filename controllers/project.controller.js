const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Project = require("../models/Project");

const projectController = {};

//1. Authenticated admin can create task and give task to staff
projectController.createProject = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { name, detail, duedate } = req.body;

  const project = await Project.create({
    name,
    detail,
    duedate,
    assigner: currentUserId,
  });

  return sendResponse(
    res,
    200,
    true,
    project,
    null,
    "Create Project successful"
  );
});

// 2. Authenticated admin can see a list of task.
projectController.getAllTasks = catchAsync(async (req, res, next) => {
  // let tasksList = await Task.find()
  //   .populate("assignee")
  //   .sort({ createdAt: -1 });
  let projectList = await Project.find().sort({ createdAt: -1 });

  return sendResponse(
    res,
    200,
    true,
    { projectList },
    null,
    "Get all user successful"
  );
});

// 3. Authenticated admin can update task.
projectController.updateProject = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { projectId } = req.params;
  const { status } = req.body;
  await Project.findByIdAndUpdate(projectId, { status });

  return sendResponse(res, 200, true, task, null, "Update Task Successful");
});

// 4. Authenticated admin can delete task.
projectController.deleteProject = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  let task = await Task.findOneAndDelete({
    _id: taskId,
  });
  if (!task) {
    throw new AppError(404, "Task not found", "Update Task Error");
  }
  return sendResponse(res, 200, true, {}, null, "Delete Task Successful");
});

module.exports = projectController;

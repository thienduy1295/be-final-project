const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Bim = require("../models/BimLib");

const bimController = {};

// 1. Admin can create Lib's item
bimController.createBim = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let { name, imageUrl, fileUrl, type } = req.body;
  let bim = await Bim.findOne({ name });
  if (bim) {
    throw new AppError(409, "Bim already exists", "Create Bim Error");
  }
  const newBim = {};
  newBim.name = name;
  newBim.imageUrl = imageUrl ? imageUrl : "";
  newBim.fileUrl = fileUrl ? fileUrl : "";
  newBim.type = type;

  bim = await Bim.create(newBim);

  return sendResponse(res, 200, true, bim, null, "Create Bim Successful");
});

// 2. Admin can update Lib's item
bimController.updateBim = catchAsync(async (req, res, next) => {
  const { bimId } = req.params;

  let bim = await Bim.findOne({ _id: bimId });
  if (!bim) {
    throw new AppError(400, "Bim model not found", "Update Bim Error");
  }
  const allows = ["name", "imageUrl", "fileUrl", "type"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      bim[field] = req.body[field];
    }
  });
  await bim.save();

  return sendResponse(res, 200, true, bim, null, "Update Bim Successful");
});

// 3. Admin can delete Lib's item.
bimController.deleteBim = catchAsync(async (req, res, next) => {
  const { bimId } = req.params;

  let bim = await Bim.findOneAndDelete({
    _id: bimId,
  });

  if (!bim) {
    throw new AppError(400, "Bim model not found", "Update Bim Error");
  }

  return sendResponse(res, 200, true, {}, null, "Update Bim Successful");
});

// 4. Staff can see list of Lib.
bimController.getAllBim = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterCondition = [];

  const allow = ["name", "type"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : {};

  const count = await Bim.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let bimsList = await Bim.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
  return sendResponse(
    res,
    200,
    true,
    { bimsList, count, totalPage, page },
    null,
    "Get all user successful"
  );
});

bimController.getSingleBim = catchAsync(async (req, res, next) => {
  const { bimId } = req.params;

  const bim = await Bim.findById(bimId);
  if (!bim) {
    throw new AppError(404, "Bim model not found", "Get bim error");
  }
  return sendResponse(
    res,
    200,
    true,
    bim,
    null,
    "Get single bim by id successful"
  );
});

module.exports = bimController;

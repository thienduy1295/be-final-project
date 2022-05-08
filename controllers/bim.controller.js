const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Bim = require("../models/BimLib");

const bimController = {};

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

module.exports = bimController;

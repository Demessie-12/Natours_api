//  lecture 58 users routes

const User = require('../models/usermodel');
const catchAsync = require('../utilis/catchAsync');
const AppError = require('./../utilis/appError');
const factory = require('./handlerFactory');

const filterObj = function (Obj, ...filteredField) {
  const newObj = {};
  Object.keys(Obj).forEach((el) => {
    if (filteredField.includes(el)) {
      newObj[el] = Obj[el];
    }
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  console.log(req.file);
  console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "You can't update password here. Please use /updateMyPassword "
      )
    );
  }

  // 2) filtered out unwanted fields names that are not allowed to updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update filtered fields
  const newuser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: newuser },
  });
  console.log('done');

  // next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = factory.UpdateOne(User);
exports.deleteUser = factory.DeleteOne(User);

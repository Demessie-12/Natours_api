const Tour = require('../models/tourmodel');
const catchAsync = require('../utilis/catchAsync');
const appError = require('../utilis/appError');
const User = require('../models/usermodel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Overview',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Get the data, for the review, users
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new appError('There is no tour with that name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginform = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
});

exports.getMe = (req, res) => {
  res.status(200).render('account', {
    title: 'My profile',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('hgfd');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'My profile',
    user: updatedUser,
  });
});

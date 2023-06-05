const AppError = require('../utilis/appError');
const Tour = require('./../models/tourmodel');
const APIFeatures = require('./../utilis/apiFeatures');
const catchasync = require('./../utilis/catchAsync');
const factory = require('./handlerFactory');
//  we use it before mongodb
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// lecture 96 aliasing
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//  lecture 49  get a data from a server
exports.getAllTours = factory.getAll(Tour);

//  lecture 50  post a data from client to server
exports.createTour = factory.CreateOne(Tour);

// lecture 51  find data using id
exports.getTour = factory.getOne(Tour);

// lecture  52 and 158 update data using patch
exports.updateTour = factory.UpdateOne(Tour);

//  lecture 53 delete data
exports.deleteTour = factory.DeleteOne(Tour);
// lecture 98 Aggregation pipeline

exports.getTourStats = catchasync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // specify group based on what
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'successful',
    data: stats,
  });
});

// lecture 99 pipline unwinding

exports.getMonthlyPlan = catchasync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          // $lt: new Date(`${year}-01-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'successfuly done',
    data: plan,
  });
});

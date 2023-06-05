const catchasync = require('./../utilis/catchAsync');
const AppError = require('./../utilis/appError');
const Review = require('../models/reviewmodel');
const APIFeatures = require('./../utilis/apiFeatures');

exports.DeleteOne = (Route) =>
  catchasync(async (req, res, next) => {
    const doc = await Route.findByIdAndDelete(req.params.id, null);
    if (!doc) {
      return next(new AppError('NO document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'delete successfully',
    });
  });

exports.UpdateOne = (Route) =>
  catchasync(async (req, res, next) => {
    const doc = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('NO document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.CreateOne = (Route) =>
  catchasync(async (req, res, next) => {
    // const newTour = new tour({})
    // newTour.save()

    const doc = await Route.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Route, popOptions) =>
  catchasync(async (req, res, next) => {
    const query = Route.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('NO document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getAll = (Route) =>
  catchasync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY whick give a document
    const features = new APIFeatures(Route.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });

const fs = require('fs');
const Tour = require('../models/tourModel');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handleFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: 'startDates' },
        numToursStarts: { $sum: 1 },
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
    status: 'success',
    data: {
      plan,
    },
  });
});

// /tours-within?distance=33&center=-40,45&unit=mi
// /tours-within/33/center/-40,45/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  // console.log(lat, lng);

  if (!lat || !lng) {
    next(new AppError('Please provide latitude an longitude in the format lat, lng', 400));
  }

  // console.log(distance, lat, lng, unit);
  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    data: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // if unit = miles then convert to miles else km
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude an longitude in the format lat, lng', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], // convert to numbers
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },

    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    data: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});

// get all tours
exports.getAllTours = async (req, res) => {

  try {
    console.log('a');
    // 1 Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query);

    // 1B) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    console.log(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query =  Tour.find(JSON.parse(queryStr));

    // const tours = await Tour.find();

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      // count the total number of tours
      const numTours = await Tour.countDocuments();
      console.log(numTours);
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // Execute query
    const tours = await query;
    res.status(201).json({
      status: 'success',
      results: tours.length,
      data: {
        tour: tours,
      },
      pagination: {
        currentPage: page
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
//   // try {
//   // } catch (error) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: error,
//   //   });
//   // }
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   // console.log('a');
//   console.log(tour);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//     // return res.send('No tour found with that ID', 404);
//   }
//   console.log(tour);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
//   // console.log('b');
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findByIdAndRemove(id);
//   // checks if its a valid Id
//   if (!tour) {
//     next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // find a single tour by its ID
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // console.log(tour);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   // Tour.findOne({_id: req.params.id})
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // Execute query
//   const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
//   const tours = await features.query;
//   // console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tour: tours,
//     },
//   });
// });

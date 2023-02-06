const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res) => {
  console.log('cool');
  res.status(200).render('signup', {
    title: 'All Tours',
  });
});

exports.getOverview = catchAsync(async (req, res) => {
  // Get tour data from collection
  const tours = await Tour.find();

  //   Build template

  // render the template
  res.status(200).render('index', {
    title: 'All Tours',
    tours,
  });
});

exports.signin = catchAsync(async (req, res) => {
  // Get tour data from collection
  // const tours = await Tour.find();

  //   Build template

  // render the template
  res.status(200).render('signin', {
    title: 'All Tours',
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // // Get the data, for the requested tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  res.status(200).render('tour', {
    title: 'The forest Hiker Tour',
    tour,
  });
});

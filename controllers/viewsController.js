const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Booking = require('./../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1} Get the tour data from the collection
  const tours = await Tour.find();

  // 2) Build the template

  //   3) Render the tour data

  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get the data for the requested tour including revies and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no such tour in available', 404));
  }
  res.status(200).render('tour', { title: tour.name, tour });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', { title: 'Log in to your account' });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your Account' });
};

exports.getMyTours = async (req, res, next) => {
  // 1 get all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2 find tours with the return id
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } }); // this will select all the ids that are in the tourIDs array

  res.status(200).render('overview', { title: 'My tours', tours });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .render('account', { title: 'Your Account', user: updatedUser });
});

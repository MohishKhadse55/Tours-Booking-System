const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  //  Allow the nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getaAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deletOne(Review);
exports.updateReview = factory.updateOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   //  Allow the nested Routes
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;

//   const newreview = await Review.create(req.body);

//   res.status(200).json({
//     status: 'success',

//     data: {
//       // in es6 you dont have to specify the key value if they both have same name
//       review: newreview,
//     },
//   });
// });

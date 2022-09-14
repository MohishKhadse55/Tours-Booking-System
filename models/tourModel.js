const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    // you can also write this as name:string,
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour must have length less than or equal to 40 '],
      minlength: [3, 'Tour must have length greater  than or equal to 40 '],
      // validate: [validator.isAlpha(), 'Tour name must contain only charater'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A group must have a max Group Size '],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        // this is only for the strings
        values: ['easy', 'difficult', 'medium'],
        message: 'Difficulty should be easy , medium and difficult  ',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings should be greater than 1.0'],
      max: [5, 'Ratings should be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this only points to the current document on new document creation
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discont should be ({VALUE}) less than price',
      },
    },
    summary: {
      type: String,
      trim: true, // trim only works for the string
      required: [true, 'a tour must have summery'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide or limit  it
    },
    startDates: [Date],
    startLocation: {
      // Geo JSON -  this is not schema type option  here it a really embedded object -- determined by the type and coordinate ptoperty
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // means we expect array of numbers
      address: String,
      description: String,
      // in order to create and embedded the new documents we need the array and in that we have to specify the documents
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// - Mongoose call this get function itself
// - this points to the document currently being processed document
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // tour field is called the tour in the review model and here it will be called the _id
  localField: '_id',
});

// Document middleware runs only before sava() and create()    and not on insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id)); // this async function return the promise
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//query MIddleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took ${Date.now() - this.start} milliSeconds`);
  next();
});

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema); // created the model out of the schema

module.exports = Tour;

const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./usermodel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less or euall than 40 characters'],
      minLength: [10, 'A tour must have less or euall than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['difficult', 'medium', 'easy'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      Set: (val) => Math.round(val * 10) / 10, // se lecture 166
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only point to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than actual price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide sensetive data like password from client
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
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
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    // ref = refer to which model
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// lecture 163 Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// lecture 100  virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// lecture 153 Virtual populate Tours
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// lecture 101 DOCUMENT MIDDLEWARE: runs only on .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // this access a document to be save
  next();
});

// lecture 147 Tour guide embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromies = this.guides.map((id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromies);
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc); // doc is document allready saved
//   next();
// });

// lecture 102 QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // /^find/ indicate it woerk on all method start with find like findById, FindOne..
  this.find({ secretTour: { $ne: true } }); // this access the query
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -_passwordChangedAt' });
  next();
});

tourSchema.post(/^find/, function (next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds`);
});

// lecture 103 AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

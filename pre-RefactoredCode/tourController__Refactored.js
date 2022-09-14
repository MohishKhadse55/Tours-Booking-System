const Tour = require('./../models/tourModel');

// IN the refactoruing we have added the all the code in class as it was lookin little bit messay

// //read the file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// ); // here tours is in json format which is a whole array of different objects

// exports.chechId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

/// Tours route handler
// 1

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,prce';
  req.query.fields = 'name,price,ratingsAverage,summart,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  // BUILD QUERY
  // 1 A) Filtering
  const queryObj = { ...req.query }; // copied the object cause ther is a referencing in the js
  console.log(queryObj);

  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]); //Property accessors - you can use the bracket notation with the object to accest the property
  console.log(req.query, req.query.sort, queryObj);

  // 1 B) Advance Filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  console.log(JSON.parse(queryString));

  let query = Tour.find(JSON.parse(queryString)); // Tour.find(queryObj);it is a query and it has some methds which can be chained to the query but we have to do it befor the await

  // 2) SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy); // req.query.sort = price
  } else {
    query = query.sort('-createdAt');
  }

  // 3 limiting Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 4 Pagination
  const page = req.query.page * 1 || 1; // * 1 - to convert the string to the number
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error('This page does not exist');
  }

  // execute the query
  const tours = await query; // until this our query might be query.sort().select().skip(),limit()

  try {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        // in es6 you dont have to specify the key value if they both have same name
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// 2
// get Tours
exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  try {
    res.status(200).json({
      status: 'success',
      data: {
        // in es6 you dont have to specify the key value if they both have same name
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }

  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
};

// 3
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: error,
    });
  }

  // // console.log(req.body); // typeof req.body == object
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );

  // // res.send('done');
};

// 4
exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// 5
exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  try {
    res.status(204).json({
      status: 'success',
      data: 'Null',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

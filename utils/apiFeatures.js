class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // here we will be manipulatin this.query form every method and thne ata the end we will execute
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // copied the object cause ther is a referencing in the js
    console.log(queryObj);

    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]); //Property accessors - you can use the bracket notation with the object to accest the property
    // console.log(req.query, req.query.sort, queryObj);

    // 1 B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr)); // Tour.find(queryObj);it is a query and it has some methds which can be chained to the query but we have to do it befor the await
    return this; // using thi we can chain the methods
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // req.query.sort = price
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1; // * 1 - to convert the string to the number
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }
    return this;
  }
}

module.exports = APIFeatures;

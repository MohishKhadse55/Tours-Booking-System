module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // instead of catch(err=> next(err))
  };
};

// --------------**************************************************************---------------------------------------
//                                                  SAMPLE
//                                              UNDERTAND THIS WHEN YOU GOT TIME
/*     
   
                const catchAsync =  (fn) => {
                return (req, res, next) => {
                    fn(req, res, next).catch(next); // instead of catch(err=> next(err))
                };
                };


                exports.createTour = catchAsync(async (req, res, next) => {
                const newTour = await Tour.create(req.body);
                res.status(201).json({
                    status: 'success',
                    data: {
                    tour: newTour,
                    },
                })); 
  */

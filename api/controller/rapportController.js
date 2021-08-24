const Rapport = require('../modal/rapport');

exports.rapport_create = function(req, res ) {
  let rapport = new Rapport({
    product: req.body.product,
    zone: req.body.zone,
    year: req.body.year,
    month: req.body.month,
    value:req.body.value

  });

  rapport.save(function (err) {
    if(err) {
      return next(err);
    }
    res.send('rapport created successfully');
  });
};
exports.getRapports = function (req, res) {

  Rapport.find({})
    .exec(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });

}

  // CALCULATE CHIFFRE AFFAIRE BY ZONE
  exports.calculateCAPerZone = function (req,res) {
    Rapport.aggregate([
      [
        {
          $group: {
            _id:"$zone",
            avgTotalCA: {
              $avg: "$value",

            },

          }
        },
        { $project: { _id:"$zone",
            count: { $sum: 1 },
            "zone": "$zone", "value": { $divide: [ "$avgTotalCA", 100 ] },
            total: { $multiply: [ "$value",100 ] }
              } }

      ]

      ]).exec(
      function(err, result) {
        if (err) {
          res.send(err.message);
        } else {
          res.json(result);

        }
      }
    );

  }

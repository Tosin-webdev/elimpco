const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const stripe = require('stripe')(
  'sk_test_51MkdXRDB6CPI8beonrCfwXgN5Co45YClI3DbUuwwGKMQYRH0UP5OxJAA6pSYCK3o0OJRd16c3FiAloatQUBwzqS6002m93wq9z'
);
// const User = require('../models/');

console.log(process.env.STRIPE_SECRET_KEY);
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently book tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
        // name: `${tour.name} Tour`,
        // description: tour.summary,
        // amount: tour.price * 100,
        // currency: 'usd',
        // quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

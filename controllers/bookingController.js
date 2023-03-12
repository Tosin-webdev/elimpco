const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const User = require('../models/');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently book tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout session
  const session = await Stripe.checkout.session.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

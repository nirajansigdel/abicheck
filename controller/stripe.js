const stripe = require("stripe")('sk_test_51OqWfFCMM59Ao6V6mkmptxazmOIdbBazLGlaVio3OAfL2GC8722klJqm7BM4tS7CXzlZqS2uNA7NsQDp5afxzjso00umxBReef');


const calculateOrderAmount = (items) => {
    return items.amount
}

const postPaymentIntent = async(req, res) => {
    const items = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items.amount,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
}

module.exports ={postPaymentIntent}
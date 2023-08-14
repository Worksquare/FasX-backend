// const Payment = require('../models/payment.model');
// const CentralAccount = require('../models/account.model');
// const Rider = require('../models/user.model');

// async function initiatePayment(user, order) {
//     const totalAmount = calculateTotalAmount(order.amount);
//     const interest = calculateInterest(totalAmount);

//     const payment = new Payment({
//         user: user._id,
//         order: order._id,
//         amount: totalAmount,
//         interest,
//         status: 'pending',
//         paymentMethod: 'credit_card',
//     });

//     await payment.save();

//     return payment;
// }

// async function completePayment(payment) {
//   // Simulate payment success (replace with actual payment gateway integration)
//   const paymentSuccessful = simulatePaymentSuccess();

//   if (!paymentSuccessful) {
//     throw new Error('Payment was not successful');
//   }

//   payment.status = 'paid';
//   await payment.save();

//   const finalAmount = payment.amount - payment.interest;

//   const centralAccount = await CentralAccount.findOne(); // Fetch the central account
//   centralAccount.balance += finalAmount;
//   await centralAccount.save();

//   const rider = await Rider.findOne({ user: payment.user }); // Fetch the rider associated with the user
//   rider.balance += finalAmount;
//   await rider.save();

//   return payment;
// }

// // Simulate a successful payment (replace with actual payment gateway integration)
// function simulatePaymentSuccess() {
//   return true;
// }

// function calculateTotalAmount(orderAmount) {
//   // Implement your logic for calculating the total payment amount here
//   // This could include adding shipping fees, taxes, etc.
//   return orderAmount + calculateInterest(orderAmount);
// }

// function calculateInterest(amount) {
//   // Implement your logic to calculate the interest based on the amount
//   // For example, interest might be a percentage of the total amount
//   // Return the calculated interest
// }

// module.exports = { initiatePayment, completePayment };
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/exammanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected.');
  
  // Replace this email with the email of the user you want to make an admin
  const targetEmail = 'admin@solesavvy.com'; 
  
  const user = await User.findOne({ email: targetEmail });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`Successfully elevated ${targetEmail} strictly to 'admin' role!`);
  } else {
    console.log(`User with email ${targetEmail} not found. Please create an account with this email first.`);
  }

  mongoose.connection.close();
}).catch(err => {
  console.error(err);
  process.exit(1);
});

import mongoose from "mongoose"
// MongoDB Connection String
const connectDB = async () => {
  try {
    // ✅ Remove deprecated options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('\n🔍 Troubleshooting Tips:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Make sure the database name "flixo" exists');
    console.log('4. Check if special characters in password are URL-encoded');
    process.exit(1);
  }
};

export default connectDB
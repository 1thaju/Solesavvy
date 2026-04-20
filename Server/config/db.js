const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connectionOptions = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        };
        
        await mongoose.connect('mongodb://localhost:27017/exammanagement', connectionOptions);
        console.log("✅ MongoDB Connected successfully to: exammanagement");
        
        // Listen to connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
        
    } catch (err) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', err.message);
        console.error('\n📋 Troubleshooting steps:');
        console.error('1. Check if MongoDB is running:');
        console.error('   - Windows: Open Services (services.msc) and look for "MongoDB"');
        console.error('   - Or run: mongod --version');
        console.error('2. Start MongoDB service if it\'s not running');
        console.error('3. Check if MongoDB is listening on port 27017');
        console.error('4. Try connecting manually: mongosh mongodb://localhost:27017');
        console.error('\n⚠️ Server will continue but database operations will fail!');
        // Don't exit - let the server run so we can provide better error messages
    }
}

// Check connection status
const checkConnection = () => {
    return mongoose.connection.readyState === 1; // 1 = connected
}

module.exports = { connectDB, checkConnection };
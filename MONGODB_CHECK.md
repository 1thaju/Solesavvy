# How to Check if MongoDB is Running

## Windows

### Method 1: Using Services (Recommended)
1. Press `Win + R` to open Run dialog
2. Type `services.msc` and press Enter
3. Look for "MongoDB" or "MongoDB Server" in the list
4. Check the Status column:
   - ✅ **Running** = MongoDB is active
   - ❌ **Stopped** = MongoDB is not running (Right-click → Start)

### Method 2: Using Command Prompt
```cmd
# Check if MongoDB service exists
sc query MongoDB

# Check MongoDB version (if installed)
mongod --version

# Or
mongo --version
```

### Method 3: Using Task Manager
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Go to "Services" tab
3. Look for "MongoDB" service
4. Check if it's running

### Method 4: Check if MongoDB Port is Listening
```cmd
# Check if port 27017 is in use
netstat -an | findstr 27017
```

### Method 5: Try Connecting to MongoDB
```cmd
# If MongoDB is installed, try connecting
mongosh mongodb://localhost:27017
```

## Start MongoDB Manually

### If MongoDB is installed as a service:
```cmd
# Start MongoDB service
net start MongoDB
```

### If MongoDB is installed but not as a service:
```cmd
# Navigate to MongoDB bin directory (usually)
cd C:\Program Files\MongoDB\Server\<version>\bin

# Start MongoDB
mongod --dbpath "C:\data\db"
```

## Install MongoDB (if not installed)

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service (recommended)
5. Install MongoDB Compass (optional GUI tool)

## Check MongoDB Connection from Your App

### Using Browser:
Visit: `http://localhost:5000/api/check-db`

### Using Browser Console or Terminal:
```javascript
// In browser console
fetch('http://localhost:5000/api/check-db')
  .then(res => res.json())
  .then(data => console.log(data))
```

## Common Issues

### Issue: "MongoDB service not found"
**Solution**: MongoDB is not installed or not installed as a service

### Issue: "Cannot connect to MongoDB"
**Solutions**:
1. Check if MongoDB service is running
2. Check if port 27017 is not blocked by firewall
3. Verify MongoDB is listening on localhost:27017

### Issue: "Access denied"
**Solution**: Run Command Prompt as Administrator

## Server Console Messages

When you start the server, you should see:
- ✅ `mongoDB Connected` = MongoDB is working
- ❌ Error messages = MongoDB connection failed (check troubleshooting steps)

## Quick Test

1. Open your browser
2. Go to: `http://localhost:5000/health`
3. Check the response:
   - `"database": "connected"` = ✅ MongoDB is running
   - `"database": "disconnected"` = ❌ MongoDB is not running


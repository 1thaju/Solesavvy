const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb://localhost:27017/exammanagement')
        console.log("mongoDB Connected")
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}
module.exports = connectDB
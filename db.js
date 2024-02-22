const mongoose = require('mongoose')

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    try {
        mongoose.connect("mongodb+srv://Thinkingof132_:WL3Uk2jPN4gRtnVH@ibmteama.z07s6ju.mongodb.net/?retryWrites=true&w=majority", connectionParams);
        console.log("Database Connected") 
    } catch (error) {  
        console.error(error)
    } 

}
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    date: {    
        type: Date,
        required: [true, "Please provide a time!"],
    },

    firstName: {    
        type: String,
        required: [true, "Please provide a first name!"],
    },

    // lastName: {    
    //     type: String,
    //     required: [true, "Please provide a last name!"],
    // },
  
    // email: {   
    //     type: String,
    //     required: [true, "Please provide an email!"],
    //     unique: false,  
    // },
    
    // phoneNumber: {   
    //     type: String,
    //     required: [true, "Please provide an email!"],
    //     unique: false,  
    // },

    score:{
        type: Number,
        required: [true, "will update score"],
        unique: false,  
    },

  })

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);

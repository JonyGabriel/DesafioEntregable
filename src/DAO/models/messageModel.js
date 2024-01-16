import mongoose from "mongoose";

const collectionName= 'messages';

const cartSchema= new mongoose.Schema({

    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

export const messageModel= mongoose.model(collectionName, cartSchema);
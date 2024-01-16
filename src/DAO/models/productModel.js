import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collectionName='products';

const productSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique:true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array
    }
});

productSchema.plugin(mongoosePaginate);
export const productModel= mongoose.model(collectionName, productSchema);

  
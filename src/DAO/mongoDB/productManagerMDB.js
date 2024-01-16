import { productModel } from "../models/productModel.js";
import {io} from '../../app.js';

class ProductManagerMDB{

async getProducts(){

//-------------------------------------------------------------
try{
    const products= await productModel.find();
    return products
}catch(error){
    return []
}
}

//-------------------------------------------------------------

async addProduct(product) {
    const { title, description, code, price, stock, category, thumbnails } = product;

    if (!title || !description || !code || !price || !stock || !category) {
        return 'Error al crear el producto';
    }

    const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails ?? []
    }

    try {
        const result = await productModel.create(newProduct);
        io.emit('newP', newProduct);

        return newProduct
    } catch (error) {

        return error;
    }
}

//-------------------------------------------------------------

async getProductById(id){

try {
    const product= await productModel.findOne({_id: id});
    return product
} catch (error) {
    return error
}

}

//-------------------------------------------------------------

async updateProduct(id, prod) {

    const dataProds = await productModel.find({ _id: id });

    const { title, description, code, price, stock, category, thumbnails } = prod

    const updatedProduct = {
        title: title ? title : dataProds.title,
        description: description ? description : dataProds.description,
        code: code ? code : dataProds.code,
        price: price ? price : dataProds.price,
        stock: stock ? stock : dataProds.stock,
        category: category ? category : dataProds.category,
        thumbnails: thumbnails ? thumbnails : dataProds.thumbnails
    };

    try {
        await productModel.updateOne({ _id: id }, updatedProduct);
        return updatedProduct;
    } catch (error) {
        return error
    }

}
   //-------------------------------------------------------------------------

   async deletProduct(id) {

    try {
        const result = await productModel.deleteOne({ _id: id });
        const products= await productModel.find();
        io.emit('deletProduct', products);
        
    } catch (error) {
        return error
    }

}

}

export default ProductManagerMDB
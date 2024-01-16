import fs from 'fs';
import {io} from '../../app.js';
class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    //-------------------------------------------------------------------------------------
    async addProduct(product) {

        const products = await this.getProducts();

        const productsLength = products.length;

        const { title, description, price, thumbnails, code, stock, category } = product

        const newproduct = {

            id: productsLength > 0 ? products[productsLength - 1].id + 1 : 1,
            title: title,
            description: description,
            price: Number(price),
            thumbnails: thumbnails ?? [],
            code: code,
            stock: Number(stock),
            status:true,
            category:category
        }

        products.push(newproduct);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            io.emit('newP', newproduct);

        }
        catch (error) {
            return error
        }
    }

    //-------------------------------------------------------------------------------------
    async getProducts() {

        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);

        } catch (error) {
            return this.products;
        }
    }

    //-------------------------------------------------------------------------------------
   async getProductById(id) {

        const products= await this.getProducts();

        const search = products.find(product => product.id === id);

         return search
    }

    //-------------------------------------------------------------------------------------

    async deletProduct(id){

        const products = await this.getProducts();

        const productForDelete= products.findIndex(product => product.id == id);

        if (productForDelete == -1) {
            return "not found"
        }

        try{
            products.splice(productForDelete,1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            io.emit('deletProduct', products);
        }
        catch(error){
            return error;
        }
    }

    //-------------------------------------------------------------------------------------

    async updateProduct(id,prod){

        const products = await this.getProducts();

        for(let key in products){

            if(products[key].id == id){
                products[key].title = prod.title ? prod.title : products[key].title;
                products[key].description = prod.description ? prod.description : products[key].description;
                products[key].price = prod.price ? prod.price : products[key].price;
                products[key].thumbnail = prod.thumbnail ? [...products[key].thumbnail, prod.thumbnail] : products[key].thumbnail;
                products[key].code = prod.code ? prod.code : products[key].code;
            }
        }

        try {  
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

        }
        catch (error) {
            return error
        }
    }

}

export default ProductManager;




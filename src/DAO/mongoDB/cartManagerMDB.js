import { cartModel } from '../models/cartModel.js';
import ProductManagerMDB from './productManagerMDB.js';

class CartManagerDB {

    //--------------------------------------------------------------------------

    async getCarts() {

        try {
            const carts = await cartModel.find();
            return carts;

        } catch (error) {
            return [];
        }
    }

    //--------------------------------------------------------------------------

    async createCart() {

        try {
            const result = await cartModel.create({});

            return result
        } catch (error) {

            return error;
        }

    }

    //--------------------------------------------------------------------------

    async getCartById(id) {

        try {
            const cart = await cartModel.findOne({ _id: id });
            return cart;
        } catch (error) {
            return error
        }
    }

    //--------------------------------------------------------------------------

    async addProductCart(cid, pid) {

        const products = new ProductManagerMDB();

        try {
            const carrito = await cartModel.findOne({ _id: cid });
            const prod = await products.getProductById(pid);

            if (!prod) return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.find(p => p.product._id.toString() === pid);

            console.log(product);

            if (!product) {
                carrito.products.push({ product: pid, quantity: 1 });
            }

            if (product) {
                product.quantity++;
            }

            await cartModel.updateOne({ _id: cid }, carrito);
            return 'Se agrego el producto correctamente'
        } catch (error) {
            return error
        }

    }

    //--------------------------------------------------------------------------
    async deletProductCart(cid, pid) {

        const products = new ProductManagerMDB();

        try {
            const carrito = await cartModel.findOne({ _id: cid });

            const prod = await products.getProductById(pid);

            if (!prod) return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.findIndex(p => p.product._id.toString() === pid);

            if (product === -1) return 'Carrito not found'

            carrito.products.splice(product, 1);

            await cartModel.updateOne({ _id: cid }, carrito);
            return 'Se elimino el producto correctamente'

        } catch (error) {
            return error
        }
    }

    //--------------------------------------------------------------------------

    async overwriteCart(cid, newProds){

        try {
            const carrito = await cartModel.findOne({ _id: cid });

            const prods = newProds;

            carrito.products=prods

            await cartModel.updateOne({ _id: cid }, carrito);
            return 'Nuevo carrito guardado'

        } catch (error) {
            return error
        }

    }

    //--------------------------------------------------------------------------

    async uptadeQuantity(cid,pid,newQuantity){

        const products = new ProductManagerMDB();

        try {

            const carrito = await cartModel.findOne({ _id: cid });
            const prod = await products.getProductById(pid);

            if (!prod) return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.find(p => p.product._id.toString() === pid);

            if (!product) {
                return 'Product not found'
            }

            if (product) {
                product.quantity= newQuantity;
            }

            await cartModel.updateOne({ _id: cid }, carrito);
            return carrito
            
        } catch (error) {
            return error
        }
    }

     //--------------------------------------------------------------------------

     async deletCart(cid){

        try {
            const carrito = await cartModel.findOne({ _id: cid });

            if (!carrito) return 'Carrito not found'

            carrito.products=[];

            await cartModel.updateOne({ _id: cid }, carrito);
            return 'Se elimino todos los productos del carrito'

        } catch (error) {
            return error
        }
     }
}

export default CartManagerDB
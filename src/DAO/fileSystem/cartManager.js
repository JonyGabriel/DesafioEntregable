import fs from 'fs';
import ProductManager from './productManager.js'

class CartManager{

constructor(path){
    this.path=path
}

//-------------------------------------------------------------------------------------
async getCarts() {

    try {
        const carts = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(carts);

    } catch (error) {
        return [];
    }
}
//-------------------------------------------------------------------------------------
async createCart(){

    const carts = await this.getCarts();

    const cartsLength = carts.length;

    const newCart={
        
    id: cartsLength > 0 ? carts[cartsLength - 1].id + 1 : 1,
    products:[]
    }

    carts.push(newCart);

    try {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }
    catch (error) {
        return error
    }
}

//-------------------------------------------------------------------------------------
    async getCartById(id) {

    const cartList= await this.getCarts();

    const search = cartList.find(cart=> cart.id == id)

    return search
}

//-------------------------------------------------------------------------------------

async addProductCart(cid,pid){

const products= new ProductManager('./products.json');

try{ 
    const cartList= await this.getCarts();
    const carrito = cartList.find(cart => cart.id === cid)
    const prod = await products.getProductById(pid);

    if(!prod) return 'Producto not found'
    if(!carrito) return 'Carrito not found'

    const product = carrito.products.find(p => p.pid === pid );

    if(!product) {
        carrito.products.push({pid: pid, quantity: 1});
    } 
        
    if(product){
        product.quantity ++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'))
    return 'Se agrego el producto correctamente'
} catch (error) {
    return error
}

}

}

export default CartManager
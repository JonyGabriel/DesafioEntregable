import { Router } from 'express';
import CartManager from '../DAO/fileSystem/cartManager.js'
import CartManagerDB from '../DAO/mongoDB/cartManagerMDB.js';

const router = Router()

const carts = new CartManager('./carrito.json');
const cartsDB = new CartManagerDB();
//-------------------------------------------------------------------------------------

router.post('/', (req, res) => {

    try {

        const cartList = cartsDB.createCart();

        res.send({ status: "Cart created" })

    } catch (error) {
        return error
    }
});

//-------------------------------------------------------------------------------------

router.get('/:cid', async (req, res) => {
    try {

        const idCart = req.params.cid;
        const cartFound = await cartsDB.getCartById(idCart);

        if (!cartFound) return (res.status(400).send({ status: "Error cart not founded" }));

        return res.send({ status: cartFound })
    } catch (error) {

    }
});

//-------------------------------------------------------------------------------------

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const product = await cartsDB.addProductCart(cid, pid);

        res.send({ result: product })

    } catch (err) {
        res.status(500).send("Error al agregar producto al carrito" + err)
    }

})

//-------------------------------------------------------------------------------------

router.delete('/:cid/product/:pid', async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsDB.deletProductCart(cid,pid)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error al borrar el carrito" + err)
    }

})

//-------------------------------------------------------------------------------------

router.put('/:cid', async (req, res) => {

    try {
        const cid = req.params.cid;

        const result = await cartsDB.overwriteCart(cid, req.body)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error al sobrescribir el carrito" + err)
    }

})

//-------------------------------------------------------------------------------------

router.put('/:cid/product/:pid', async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const {quantity}= req.body;

        const result = await cartsDB.uptadeQuantity(cid,pid,quantity);

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error quantity" + err)
    }

})

//-------------------------------------------------------------------------------------
router.delete('/:cid', async (req, res) => {

    try {
        const cid = req.params.cid;

        const result = await cartsDB.deletCart(cid)

        res.send({ result: result })

    } catch (err) {
        res.status(500).send("Error al vaciar el carrito" + err)
    }

})

export default router
import { Router } from "express";
import ProductManager from "../DAO/fileSystem/productManager.js";
import {productModel}  from "../DAO/models/productModel.js";
import CartManagerDB from "../DAO/mongoDB/cartManagerMDB.js";
import { cartModel } from "../DAO/models/cartModel.js";

const router=Router();

const productList= new ProductManager("./products.json");
const products= await productList.getProducts();

function justPublicWitoutSession(req, res, next) {
    if(!req.session?.user) return res.redirect('/api/session/login')
    
    return next()
}

function auth(req, res, next) { 
    if(req.session?.user)  res.redirect('/')

    return next()
}

//---------------------------------------------------------------------

router.get('/', justPublicWitoutSession , async (req,res)=>{

try {

    const limit= parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const query= req.query?.query ?? '';
    const search={}
    const sort= req.query?.sort ?? '0';

    if(query) search.category = { "$regex": query, "$options": "i" }
    const options={
        limit:limit,
        page:page,
        lean:true,
    }

    if(sort != 0){
        options ["sort"]={price:sort == 'asc' ? 1 : -1} 
    }
    const productsDB= await productModel.paginate(search,options);

    productsDB.payload= productsDB.docs;
    productsDB.status= 'success',
    productsDB.query= query
    productsDB.sortCero= sort === '0'
    productsDB.sortAsc= sort === 'asc'
    productsDB.sortDesc= sort === 'desc'
    delete productsDB.docs



    res.render('home',{
        products:productsDB.payload,
        style: 'index.css',
        productData:productsDB,
        userName:req.session.user
    });

} catch (error) {
    return error;
}

});

//---------------------------------------------------------------------

router.get('/realTimeProducts', async (req,res)=>{

try {

    const productsDB= await productModel.paginate({},{
        limit:10,
        page:1,
        lean:true,
    })

    productsDB.payload= productsDB.docs;
    productsDB.status= 'success'
    delete productsDB.docs

    res.render('realTimeProducts',{
        products:productsDB.payload,
        style: 'index.css'
    });

} catch (error) {
    return error;
}

});

//--------------------------------------------------------------------------------------

router.get('/carts/:cid', async (req,res)=>{

try {

    const {cid}=req.params

    const cart= new CartManagerDB();

    const cartSearch= await cartModel.findOne({ _id: cid }).lean().exec();

    if(!cartSearch) return res.status(400).send({error:'Cart not found'})

    console.log(cartSearch.products);

    res.render('cart',{
        style:'index.css',
        cart:cartSearch.products
    })
    
} catch (error) {
    return error
}

})

//--------------------------------------------------------------------------------------

router.get('/api/session/register', auth, (req,res)=>{

    return res.render('register',{style: 'index.css'});
});

//--------------------------------------------------------------------------------------

router.get('/api/session/login', auth, (req,res)=>{

    return res.render('login',{style: 'index.css'});
});

router.get('/api/session/profile', justPublicWitoutSession, (req,res)=>{

    const user= req.session.user

    return res.render('profile',{style: 'index.css', userData:user});
});

export default router
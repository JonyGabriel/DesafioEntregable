import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import envs from '../enviroment.js';

import productsRouter from './routes/products-router.js';
import cartsRouter from './routes/cart-router.js';
import productsViews from './routes/views-router.js';
import messageRouter from './routes/messages-router.js';
import sessionRouter from './routes/session-router.js';

import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';

import mongoose from 'mongoose';
import DBMessageManager from './DAO/mongoDB/messageManager.js';

import initializePassport from './config/passport-config.js';
import passport from 'passport';





const app = express();
const url = (envs.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: url,
        dbName: 'ecommerce'
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', productsViews);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/messages', messageRouter);
app.use('/api/session', sessionRouter);

const httpServer = app.listen(envs.PORT, () => console.log("Servidor activo "));
const io = new Server(httpServer);



mongoose.connect(url, { dbName: 'ecommerce' });

const messages = new DBMessageManager();

io.on('connection', async socket => {

    console.log("Nuevo usuario conectado");

    const messageHistory = await messages.sendMessages();

    socket.on('message', async data => {
        const newMessage = await messages.addMessage(data);
        messageHistory.push(data);

        io.emit('messagesLogs', messageHistory);
    });

    socket.on('userConnect', data => {
        socket.emit('messagesLogs', messageHistory)
    })
});

export { io }
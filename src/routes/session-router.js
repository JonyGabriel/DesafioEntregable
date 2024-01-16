import { Router } from "express";
import passport from 'passport';

const router= Router();

//--------------------------------------------------------------------------------------

router.post('/register', passport.authenticate('register', {failureRedirect:'/'}) ,async (req,res)=>{

    res.redirect('/api/session/login');
})


//--------------------------------------------------------------------------------------

router.post('/login', passport.authenticate('login', {failureRedirect: '/'}) ,async (req,res) =>{

if(!req.user) return res.status(404).send('User Not Found');

req.session.user = req.user

return res.redirect('/')

});


router.post('/profile', async (req,res) =>{

    req.session.destroy(error => {if(error) return res.send('Error al cerrar session')})
    
    return res.redirect('/api/session/login')
    
});

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { }
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/error'}),
    (req, res) => {
        console.log('Callback: ', req.user)

        req.session.user = req.user
        console.log('User Session setted')

        res.redirect('/')
    }
)













export default router
import express, { urlencoded } from 'express';
import session from 'express-session';
import JobController from './src/controllers/job.controller.js';
import UserController from './src/controllers/user.controller.js';
import expressEjsLayouts from 'express-ejs-layouts';
import FormValidator from './src/middleware/formValidator.middleware.js';
import upload from './src/middleware/fileUpload.middleware.js';
import path from 'path';
import { auth } from './src/middleware/auth.middleware.js';


const server = express();

server.use(session({
    secret:'secretKey',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());


// setting view engine
server.set('view engine','ejs');
server.set('views',path.join(path.resolve(),"src","views"));

server.use(expressEjsLayouts);


 
server.use(express.static('src/views'));
server.use('/public', express.static('public'));



// creating an instance for home Controller
server.get('/',(req,res)=>{
    res.render('home',{ showSearchBar: false,  userEmail:req.session.userEmail });
})
// creating an instane for Validation
const validator = new FormValidator();
// creating an instance for User Controller 
const userController = new UserController();
server.post('/register',validator.userRegisterForm,userController.postRegister);
server.get('/login', (req, res) => {
    res.render('loginpage', {
        showSearchBar: false,
        userEmail: req.session.userEmail
    });
});
server.post('/login',userController.postLogin);
server.get('/logout',userController.postLogout);


// creating an instance for Job Controller 
const jobController = new JobController;
server.get('/jobs',jobController.jobListPage);
server.get('/job/:id',jobController.jobDetailsPage);
server.get('/job/:id/applicants',auth,jobController.applicantListPage);
server.post('/job/:id/',upload,validator.applicantForm,jobController.applicantApply);
server.get('/postnewjob',auth,jobController.postNewJob);
server.post('/postnewjob',validator.postNewJob,jobController.postNewJobForm);
server.get('/delete-job/:id', auth, jobController.deleteJob);
server.post('/updatejob/:id',auth,jobController.postUpdateJobForm);



// Handle 404 errors
server.use((req, res, next) => {
    res.status(404).render('pageNotFound',{ showSearchBar: false });
  });




server.listen(3000);

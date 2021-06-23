import express from 'express';
import UsersCtrl from './users.controller.js';
// import CardCtrl from './cards.controller.js';

const router = express.Router();

// router.get('/', UsersCtrl.apiGetUsers)
router
    .route('/')
    .get(UsersCtrl.apiGetUsers)
    .put(UsersCtrl.apiUpdateUsers)
    .delete(UsersCtrl.apiDeleteUser) 
    .post(UsersCtrl.apiPostUser)
    

// router
//     .route('/')
//     .get(CardCtrl.apiGetCards)
//     .post(CardCtrl.apiPostCard)
//     .put(CardCtrl.apiPutCard)
//     .delete(CardCtrl.apiDeleteCard)

export default router;
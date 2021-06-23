import express from 'express';
import CardCtrl from './cards.controller.js';

const router = express.Router();

router
    .route('/')
    .get(CardCtrl.apiGetCards)
    .post(CardCtrl.apiPostCards)
    .put(CardCtrl.apiUpdateCard)
    .delete(CardCtrl.apiDeleteCard)

router
    .route("/:id")
    .get(CardCtrl.apiGetCardsById)


export default router;
import CardsDAO from '../data_access_object/cardsDAO.js';

export default class CardsController {
    static async apiGetCards(req, res, next){
        const cardsPerPage = req.query.cardsPerPage ? parseInt(req.query.cardsPerPage, 10) : 20 ;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {}

        if(req.query.name){
            filters.name = req.query.name
        }
        // else if(req.query.zipcode){
        //     filters.zipcode = req.query.zipcode
        // }

        const { cardsList, totalNumCards } = await CardsDAO.getCards({
            filters,
            page,
            cardsPerPage,
        })

        let response = {
            cards: cardsList,
            page: page,
            filters: filters,
            entries_per_page: cardsPerPage,
            total_results: totalNumCards,
        }
        res.json(response)

    }

    static async apiPostCards(req, res, next) {
        try {
            // const userId = req.body.id
            const name = req.body.name
            // const userInfo = {
            //     name: req.body.name,
            //     _id: req.body.user_id
            // }
            const type = req.body.type
            const description = req.body.description
            const image = req.body.image
            const price = req.body.price

            const cardResponse = await CardsDAO.addCard(
                // userId,
                name,
                type,
                description,
                image,
                price
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateCard(req, res, next){
        try{
            const cardId = req.body.card_id
            const name = req.body.name
            const type = req.body.type
            const description = req.body.description
            const image = req.body.image
            const price = req.body.price

            const cardResponse = await CardsDAO.updateCard(
                cardId,
                name,
                type,
                description,
                image,
                price
            )

            var {error} = cardResponse
            if(error){
                res.status(400).json({error})
            }

            if(cardResponse.modifiedCount === 0){
                throw new Error("Unable to update card")
            }

            res.json({ status:"success" })

        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteCard(req, res, next){
        try{
            const cardId = req.query.id

            const cardResponse = await CardsDAO.deleteCard(
                cardId,
            )
            res.json({ status:"success" })
        } catch(e){
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetCardsById(req, res, next) {
        try {
            let id = req.params.id || {}
            let card = await CardsDAO.getCardByID(id)
            if (!card) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(card)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

}
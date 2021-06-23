import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

let cards;

export default class CardsDAO{

    //Connect to DB
    static async injectDB(conn){
        if(cards){
            return
        }
        try{
            cards = await conn.db(process.env.PEARL_NS).collection("cards")
        } catch(e){
            console.error(`Unable to establish a collection handle in CardsDAO: ${e}`,)
        }
    }


    static async getCards({
        filters = null,
        page = 0,
        cardsPerPage = 20,
    } = {}) {
        let query
        if(filters){
            if("name" in filters){
                query = {$text: { $search: filters["name"]}}
            } else if("type" in filters){
                query = {"type": {$eq: filters["type"]}}
            }
        }

        let cursor 

        try{
            cursor = await cards
                .find(query)
        }catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {cardsList: [], totalNumCards:0}
        }

        const displayCursor = cursor.limit(cardsPerPage).skip(cardsPerPage * page)

        try{
            const cardsList = await displayCursor.toArray()
            const totalNumCards = await cards.countDocuments(query)

            return {cardsList, totalNumCards}
        }catch(e){
            console.error(
                `Unable to convert cursor to array or problem counting document, ${e}`
            )
            return {cardsList: [], totalNumCards: 0}
        }
    }


    static async addCard(name, type, description, image, price){
        try{
            const cardDoc = {
                name: name,
                type: type,
                description: description,
                image: image,
                price: price
            }
            return await cards.insertOne(cardDoc)
        } catch(e){
            console.error(`Unable to post card: ${e}`)
            return { error: e }
        }
    }

    static async updateCard(cardId, name, type, description, image, price) {
        try {
        const updateResponse = await cards.updateOne(
            { _id: ObjectId(cardId)},
            { $set: { name: name, type: type, description: description, image: image, price:price } },
        )

        return updateResponse
        } catch (e) {
        console.error(`Unable to update card: ${e}`)
        return { error: e }
        }
    }

    static async deleteCard(cardId) {

        try {
        const deleteResponse = await cards.deleteOne({
            _id: ObjectId(cardId),
        })

        return deleteResponse
        } catch (e) {
        console.error(`Unable to delete card: ${e}`)
        return { error: e }
        }
    }    

    static async getCardByID(id) {
        try {
        const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                {
                    $lookup: {
                        from: "cards",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$card_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "cards",
                    },
                },
                {
                    $addFields: {
                        cards: "$cards",
                    },
                },
            ]
        return await cards.aggregate(pipeline).next()
        } catch (e) {
        console.error(`Something went wrong in getCardByID: ${e}`)
        throw e
        }
    }


}
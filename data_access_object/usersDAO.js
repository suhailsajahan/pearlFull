import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

let users;

export default class UsersDAO{
    static async injectDB(conn){
        if(users){
            return
        }
        try{
            users = await conn.db(process.env.PEARL_NS).collection("users")
        } catch(e){
            console.error(`Unable to establish a collection handle in usersDAO: ${e}`,)
        }
    }


    static async getUsers({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query
        if(filters){
            if("name" in filters){
                query = {$text: { $search: filters["name"]}}
            } else if("discription" in filters){
                query = {"description": {$eq: filters["description"]}}
            }
        }

        let cursor 

        try{
            cursor = await users
                .find(query)
        }catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {usersList: [], totalNumUsers:0}
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try{
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await users.countDocuments(query)

            return {usersList, totalNumUsers}
        }catch(e){
            console.error(
                `Unable to convert cursor to array or problem counting document, ${e}`
            )
            return {usersList: [], totalNumUsers: 0}
        }
    }


    static async addUser(name, email, description){
        try{
            const userDoc = {
                name: name,
                email: email,
                description: description,
            }
            return await users.insertOne(userDoc)
        } catch(e){
            console.error(`Unable to post user: ${e}`)
            return { error: e }
        }
    }

    static async updateUser(userId, name, email, description) {
        try {
        const updateResponse = await users.updateOne(
            { _id: ObjectId(userId)},
            { $set: { name: name, email: email, description: description } },
        )

        return updateResponse
        } catch (e) {
        console.error(`Unable to update user: ${e}`)
        return { error: e }
        }
    }

    static async deleteUser(userId) {

        try {
        const deleteResponse = await users.deleteOne({
            _id: ObjectId(userId),
        })

        return deleteResponse
        } catch (e) {
        console.error(`Unable to delete user: ${e}`)
        return { error: e }
        }
    }    


}
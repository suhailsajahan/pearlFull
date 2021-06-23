import UsersDAO from '../data_access_object/usersDAO.js';

export default class UsersController {
    static async apiGetUsers(req, res, next){
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20 ;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {}

        if(req.query.name){
            filters.name = req.query.name
        }
        // else if(req.query.zipcode){
        //     filters.zipcode = req.query.zipcode
        // }

        const { usersList, totalNumUsers } = await UsersDAO.getUsers({
            filters,
            page,
            usersPerPage,
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: totalNumUsers,
        }
        res.json(response)

    }

    static async apiPostUser(req, res, next) {
        try {
            // const userId = req.body.id
            const name = req.body.name
            // const userInfo = {
            //     name: req.body.name,
            //     _id: req.body.user_id
            // }
            const email = req.body.email
            const description = req.body.description

            const userResponse = await UsersDAO.addUser(
                // userId,
                name,
                email,
                description,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateUsers(req, res, next){
        try{
            const userId = req.body.user_id             //same names we provided here must be given in the front end (when passing to the api)
            const name = req.body.name
            const email = req.body.email
            const description = req.body.description

            const userResponse = await UsersDAO.updateUser(
                userId,
                name,
                email,
                description
            )

            var {error} = userResponse
            if(error){
                res.status(400).json({error})
            }

            if(userResponse.modifiedCount === 0){
                throw new Error("Unable to update user")
            }

            res.json({ status:"success" })

        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteUser(req, res, next){
        try{
            const userId = req.query.id

            const userResponse = await UsersDAO.deleteUser(
                userId,
            )
            res.json({ status:"success" })
        } catch(e){
            res.status(500).json({ error: e.message })
        }
    }


}
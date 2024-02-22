const {User} = require('../models/user');

async function getUsers(req, res, next) {
    try{
        user = await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({ message: 'User does not exist!'})
        }
    } catch(error){
        return res.status(500).json({ message: error.message })
    }

    res.user = user
    next()
}

module.exports = getUsers();
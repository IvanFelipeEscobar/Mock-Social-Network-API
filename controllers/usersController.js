const {Users} = require(`../models`)

module.exports = {
   // Get all users
   getUsers(req, res) {
    Users.find()
      .populate({path: `thoughts`, select: `-__v`})
      .populate({path: `friends`, select: `-__v`})
      .select(`-__v`)
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  //get user by id (single user)
  getSingleUser(req, res) {
    Users.findOne({ _id: req.params.userId })
      .populate({path: `thoughts`, select: `-__v`})
      .populate({path: `friends`, select: `-__v`})
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  } ,
     // create a new user
  createUser(req, res) {
    Users.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  //update user by id
  updateUser(req, res){
    Users.findOneAndUpdate({_id: req.params.userId},
      { $set: req.body },
      { runValidators: true, new: true })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with this id!' })
            : res.json(user))
  },
  //delete user by id
}
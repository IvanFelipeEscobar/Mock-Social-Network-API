const { Thoughts, Users } = require(`../models`)
//all thoughts
module.exports = {
    getThoughts (req, res) {
        Thoughts.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err))
    },
 //single though by id
    getSingleThought (req, res) {
        Thoughts.findOne({id: req.params.thoughtId})
            .then((thought) => 
            !thought
                ? res.status(404).json({message: `no thought found`})
                : res.json(thought))
            .catch((err) => res.status(500).json(err))
            
    },
// create new though
    createThought (req, res){
        Thoughts.create(req.body)
            .then((thought) => {
                return Users.findByIdAndUpdate(
                    {_id: req.body.userId},
                    {$addToSet: {thoughts: thought._id}},
                    {new: true}
                )
            })
            .then( (user) =>
            !user
                ? res.status(404).json({message: `thought created, no user found by that id though`})
                : res.json('thought succesfully created'))
            .catch((err) => res.status(500).json(err))
    },
// edit though by id
    updateThought (reg, res){
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
            .then((thought) => {
                !thought
                    ? res. status(404).json({message:`no thought found by that id`})
                    : res.json(thought)
            })
            .catch((err) => res.status(500).json(err))

    },
// delete thought
    deleteThought (req, res) {
        Thoughts.findByIdAndRemove({_id: req.params.thoughtId})
            .then((thought)=>
                !thought
                    ? res.status(404).json({message: `no thought found`})
                    : Users.findByIdAndUpdate(
                        {thoughts: req.params.thoughtId},
                        {$pull: {thoughts: req.params.thoughtId}},
                        {new: true}
                    ))
                    .then((user) =>
                    !user
                      ? res.status(404).json({
                          message: 'Thought deleted but no user with this id!',
                        })
                      : res.json({ message: 'Thought successfully deleted!' })
                  )
                  .catch((err) => res.status(500).json(err))
    },
// add reaction to an existing thought
    createReaction (req, res) {
        Thoughts.findByIdAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        )
            .then((thought) =>
            !thought
                ?res.status(404).json({message: `no thought found`})
                : res.json(thought))
                .catch((err) => res.status(500).json(err))
    },
// delete thought reaction
    deleteReaction (req, res){
        Thoughts.findByIdAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
            .then((thought) =>
            !thought
                ?res.status(404).json({message: `no thought found`})
                : res.json(thought))
                .catch((err) => res.status(500).json(err))
    }
}

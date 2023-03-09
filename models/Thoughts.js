const {Schema, model, Types} =  require(`mongoose`)
//thoughts schema
const ThoughtsSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})
//reaction schema (Schema only)
const ReactionSchema = ({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: {
        getters: true
    }
})

ThoughtsSchema.virtual(`reactionCount`).get(function(){
    return this.reactions.length
})

const Thoughts = model(`Thoughts`, ThoughtsSchema)

module.exports = Thoughts
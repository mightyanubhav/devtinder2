const mongoose = require('mongoose')
function validator(v){
    return ['interested', 'rejected', 'ignored', 'match'].includes(v)
}
const status_schema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator, "it can either be 'interested, 'rejected','ignored', 'match'"]
    }
})

const Status = mongoose.model('Status', status_schema)

module.exports = Status
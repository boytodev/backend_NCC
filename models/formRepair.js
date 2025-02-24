const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let repairSchema = new Schema({
    createdAt: {
        type: String
    },
    name: {
        type: String
    },
    room:{
        type: String
    },
    pc: {
        type: String,
    },
    category: {
        type: String
    },
    urgency: {
        type: String
    },
    detail: {
        type: String
    },
    status: {
        type: String
    },
}, {
    collection: 'repairs'
})

module.exports = mongoose.model('repair', repairSchema);
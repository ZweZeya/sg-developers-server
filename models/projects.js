const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./users')

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: User.schema,
});

module.exports = {
    model: mongoose.model('Project', projectSchema),
    schema: projectSchema,
};
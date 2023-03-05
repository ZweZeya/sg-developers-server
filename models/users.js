const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contacts: {
        personal: {
            phone: {
                type: Number,
                required: true,
            },
        },
        universal: {
            linkedin: String,
            github: String,
        },
    }, 
    telegramId: {
        type: Number,
        required: true,
    },
});

module.exports = {
    model: mongoose.model('User', userSchema),
    schema: userSchema,
};


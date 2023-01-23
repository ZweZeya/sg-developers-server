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
        private: {
            phone: Number,
            email: String,
        },
        public: {
            linkedin: String,
            github: String,
        },
    }, 
    telegramId: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);


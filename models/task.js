const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: [{
        type: Number,
        required: true,
    }],
    type: {
        type: String,
        enum: ["+", "-"],
        required: true,
    }
}, { timestamps: true });

const Tasks = mongoose.model("Task", taskSchema);

module.exports = Tasks;
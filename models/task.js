const mongoose = require("mongoose");


const subSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true,
    }
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: [subSchema],
    type: {
        type: String,
        enum: ["+", "-"],
        required: true,
    }
}, { timestamps: true });

const Tasks = mongoose.model("Task", taskSchema);

module.exports = Tasks;
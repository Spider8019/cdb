const express = require('express')
const mongoose = require("mongoose");
const cors = require("cors");
const taskModel = require("./models/task")
const app = express()
const ip = require('ip')
const port = 4000

mongoose.connect('mongodb+srv://cduser:Spider8019@cluster0.u9p42lo.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    const response = "aman pratap singh"
    res.send(response);
})
app.post('/addtask', async (req, res) => {
    const task = new taskModel({
        title: req.body.title,
        date: req.body.date,
        type: req.body.type,
    })
    const response = await task.save();
    console.log(response)
    res.send(response);
})
app.post("/recreatetask", async (req, res) => {
    const task = await taskModel.findOne({ _id: req.body.id })
    const response = await taskModel.findByIdAndUpdate(req.body.id, { date: [...task.date.slice(0, -1), task.date[task.date.length - 1] - (new Date().getTime()), new Date().getTime()] })
    res.send(response)
})
app.get('/alltask', async (req, res) => {
    const tasks = await taskModel.find({})
    res.json(tasks);
})
app.delete("/deletetask", async (req, res) => {
    const response = await taskModel.findByIdAndDelete(req.body._id)
    res.json(response);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
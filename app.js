const express = require('express')
const mongoose = require("mongoose");
const cors = require("cors");
const taskModel = require("./models/task")
const app = express()
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
    // const response = ["Aman", "Shipra"];
    console.log(req.socket.remoteAddress)
    res.send(req.socket.remoteAddress)
})
app.post('/addtask', async (req, res) => {
    const task = new taskModel({
        ...req.body,
        ipaddress: req.socket.remoteAddress
    })
    const response = await task.save();
    res.send(response);
})
app.get('/alltask', async (req, res) => {
    // const filter = { ipaddress: req.socket.remoteAddress };
    const tasks = await taskModel.find({})
    console.log(req.socket.remoteAddress)
    res.json(tasks);
})
app.delete("/deletetask", async (req, res) => {
    const response = await taskModel.findByIdAndDelete(req.body._id)
    console.log(req.socket.remoteAddress)
    res.json(response);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
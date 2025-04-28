const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
mongoose.connect("mongodb+srv://23csu347:Password@cluster0.5guydqd.mongodb.net/todo-app")

//user schema
const User = new Schema({
    email: {type:String, unique : true},
    password: String,
    name:String
})

//todo schema
const Todo = new Schema({
    title:String,
    done:Boolean,
    userId: ObjectId
})


//models
const UserModel = mongoose.model('users', User)
const TodoModel = mongoose.model('todos',Todo)


//exporting this file so that we can import in index.js
module.exports = {
    UserModel:UserModel,
    TodoModel:TodoModel
}
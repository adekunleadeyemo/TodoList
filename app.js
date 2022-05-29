const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
day = date.getDate();
console.log(day)

mongoose.connect("clusterLink")


//   DATA STRUCTURE
//individual item schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//model for individual item
const Item = mongoose.model("Item", itemSchema)

//Default item
const defaultItem = new Item({
    name: "<-- click to delete"
})
//schema for todo list
const todoListSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
})

//model for the todo list
const TodoList = mongoose.model("TodoList", todoListSchema)

//Default todo list
const defaultTL = new TodoList({
    name: "<-- click to delete",
    items: [defaultItem]
})

//Schema for List

const listSchema = {
    name: String,
    todoLists: [todoListSchema]
    
}

//Model for List of todo list
const List  = mongoose.model("List", listSchema)


//Default List of todo list
const defaultList = new List({
    name: "myList",
    todoLists: [defaultTL]
})

//   DATA STRUCTURE


//HOME PAGE

app.get("/", function(req,res){
   
   //View all the todo list in the List
    List.findOne({name: "myList"},function(err, list){
        console.log(list)
        if(!list){
           //create new list of todo lists if none is found
           console.log(defaultList)
            defaultList.save()
            res.redirect("/")
        }

        //show list of todo list if there is no error, or simply show error if available
        if(!err){
        console.log(list.todoLists)
         res.render("home", {todoLists:list.todoLists})
        }
        else{
            console.log(err)
        }
    })
  
})


app.post("/", function(req, res){

    const newTL = req.body.newTL
    //add todoList to List
    List.findOne({name: "myList"}, function(err, list){
        if(!err){
            const tL = new TodoList({
                name: newTL,
                items:[]
            })

            list.save()
        }
        else{
            console.log(err)
        }      
    })

    
    res.redirect("/")
})











// app.get("/", function(req,res){
    
//     res.render("home")      
// })




// app.post("/",function(req, res){
//     const listName = req.body.newList
//    List.find({name: listName }, function(err,list){
//         if(!err){
//             if(list.length == 0){
//                 const listItem = new List({
//                     name: listName, 
//                     items: [enterItems]
//                 })

//                 listItem.save()

//             }
//             console.log("create new list, post home route")
//             res.redirect("/"+listName) 
//         }
//         else{
//             console.log(err)
//             res.redirect("/")
//         }
//    })

     
//  })

// app.get("/:todoList", function(req,res){
    
//     // if(reload == 0){
//     //     reload =1
//     //     res.redirect("/"+req.params.todoList)
//     // }
//     res.redirect()
//     let listName = req.params.todoList
//     List.findOne({name:listName },function(err,list){
//         if(err){
//             console.log(err)
//         }
//         else{

//             console.log("Show current list items get route of "+ listName)
//             //console.log(list.items)
//             res.render("list",{listTitle: listName, items:list.items})
//         }
           
        
//     })
    
// });
// app.post("/delete",function(req, res){
//     const listName = req.body.listName
//     const itemId = req.body.checkbox
//     console.log("it gets to the delete block")
//       List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: itemId} }}, function(err,list){
//           if(!err){
//               res.redirect("/"+listName)
//           }
//       })
  
//    })

// app.post("/:todoList",function(req,res){
//     const itemName = req.body.newItem
//     const item = new Item({name:itemName })
//     const listName = req.params.todoList
//     console.log("post "+ listName)
//     List.findOne({name: listName}, function(err, list){
//         if(!err){
//             list.items.push(item)
//             list.save()
//             console.log("post new items at,  post route "+ listName )
//             console.log(list.items)
//             res.redirect("/"+ listName)
        
//         }
//     })
    
//  })




 
app.listen(3000, function(){
    console.log("server started at port 3000")
});

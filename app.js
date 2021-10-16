const express=require("express");
const bodyParser=require("body-parser");
// let ejs = require('ejs');
const date=require(__dirname+"/date.js");
const _=require("lodash");

const mongoose=require("mongoose");
// console.log(date());

mongoose.connect("mongodb://localhost:27017/todoDB",{useNewUrlParser:true});




// let lists=[];
// let work=[];
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const itemsScehma={
    name:String
};



const Item=mongoose.model("Item",itemsScehma);


const item1=new Item({
    name:"Welcome"

});
const item2=new Item({
    name:"ht 1"

});
const item3=new Item({
    name:"hit 2"

});
const defaultItem=[item1,item2,item3];
// Item.insertMany(defaultItem,function(err){
//     if(!err)
//     {
//         console.log("passed");
//     }
//     else
//     {
//         console.log(err);
//     }
// });

const listSchema={
    name:String,
    items:[itemsScehma]
};

const List=mongoose.model("List",listSchema);
app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        // console.log(foundItems);
        if(foundItems.length===0)
        {
                    Item.insertMany(defaultItem,function(err){
            if(!err)
            {
                console.log("passed");
            }
            else
            {
                console.log(err);
            }
        });
        res.redirect("/");
        }
        else
        {
            res.render("list",{title:"Today",item:foundItems});

        }
        
    });
    

})

app.post("/",function(req,res){
    let it=req.body.new
    const listName=req.body.button;
    const item=new Item({
        name:it
    });

    if(listName==='Today'){
        item.save();
        res.redirect("/");

    }
    else
    {
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
    })
    }
   
    
    // console.log(req.body);
    // if(req.body.button==='work')
    // {
    //     work.push(it);
    //     res.redirect("/work");
    // }
    // else
    // {
    //     lists.push(it);
    //     res.redirect("/");
    // }
    // lists.push(it);
    
})

app.get("/",function(req,res){


    // let day=date.getDate();

        res.render("list",{title:"Today",item:foundItems});
    
})

// app.get("/work",function(req,res){
    
//    res.render("list",{title:"work",item:work});
// })

app.get("/:name",function(req,res){

    const customListName=_.capitalize(req.params.name);
    List.findOne({name:customListName},function(err,result){
      if(!err)
      {
          if(!result)
          {
            //    console.log("dont exist");
            //  create a new list
            const list=new List({
                name:customListName,
                items:defaultItem
            });
            list.save();
            res.redirect("/"+customListName);
          }
          else
          {
             // console.log("exits");
             // print already exist
             res.render("list",{title:result.name,item:result.items});
          }
      }
      else
      {
          console.log(err)
      }
    })

   
    // console.log(req.params.name);
})

app.post("/delete",function(req,res){
    const checkedID=req.body.checkbox;
    const ListName=req.body.ListName;
    if(ListName==='Today')
    {
        Item.findByIdAndDelete(checkedID,function(err){
            if(!err)
            {
                console.log("deleted");
            }
            else
            {
                console.log(err);
            }
            res.redirect("/");
        })
    }
    else
    {
        List.findOneAndUpdate({name:ListName},{$pull:{items:{_id:checkedID}}},function(err,foundList){
            if(!err)
            {
                res.redirect("/"+ListName);
            }
        });
    }

 
    // console.log(req.body.checkbox);
}

)
app.post("/work",function(req,res){
    let it=req.body.new;
   
    work.push(it);
    res.redirect("/work");


});

app.get("/about",function(req,res){
    res.render("about");
})


app.listen(3000,function(){
    console.log("server running at 3000");
});
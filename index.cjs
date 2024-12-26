let express=require("express");
let app=express();
const path=require("path");
const port=16539;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(path.join(__dirname,"/images")))

app.listen(port,(req,res)=>{
    console.log("Server is listening to : ",port);
});


app.get("/",(req,res)=>{
    res.render("home.ejs");
});
const { HOST,USER,PASSWORD,DATABASE } = require("./.config");
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
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
const mysql=require("mysql2");

let _id=1;

const connection=mysql.createConnection({
    host:HOST,
    user:USER,
    database:DATABASE,
    password:PASSWORD
});



if(connection){
    console.log("CONNECTION IS SUCCESSFUL. ");
}


app.listen(port,(req,res)=>{
    console.log("Server is listening to : ",port);
});


app.get("/",(req,res)=>{
    let q1="SELECT * FROM imanmay2";
    
    connection.query(q1,(err,res_)=>{
        try{
            if(err) throw err;
            res.render("master.ejs",{data:res_});
        } catch(err){
            res.send(err);
        }
    });
});



//POSTING DATA IN THE DAIRY.
app.post("/",(req,res)=>{
    let {post_}=req.body;
    let q1="INSERT INTO imanmay2(post_id,post_date,post_text,IsBookmarked,IsLiked) VALUES(?,?,?,?,?)";
    data_=[_id,new Date(),post_.toString(),0,0];
    _id=_id+1;
    connection.query(q1,data_,(err,res_)=>{
        try{
            if(err) throw err;
            res.redirect("/");
            // res.render("master.ejs",{data:res_});
        }
        catch(err){
            res.send(err);
        }
    })
});
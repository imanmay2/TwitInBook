const { HOST, USER, PASSWORD, DATABASE } = require("./.config");
let express = require("express");
let app = express();
const path = require("path");
const port = 16539;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(path.join(__dirname, "/images")))
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const mysql = require("mysql2");


let _id = null;

//Function for Date function.
function getDate(date) {
    var date = new Date(date);
    date = date.toString().substring(4, 15);
    date = date.substring(0, 6) + "," + date.substring(6);
    return date.trim();
}

// function for Update command.
function update(table_name,field,dataset,res){
    let q1 = `UPDATE ${table_name} SET ${field}=? WHERE post_id=?`;
    connection.query(q1, dataset, (err, _) => {
        try {
            if (err) throw err;
            res.redirect("/");
        } catch (err) {
            res.send(err);
        }
    })
}


const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    database: DATABASE,
    password: PASSWORD
});



if (connection) {
    connection.query("create table if not exists imanmay2(post_id int(10),post_date date,name varchar(50) default \"Manmay Chakraborty\",post_text text,isBookmarked int(2) default 0,isLiked int(2) default 0);");
    console.log("CONNECTION IS SUCCESSFUL. ");

    //SETTING UP THE ID. 
    connection.query("select * from imanmay2", (err, res) => {
        if (res.length > 0) {
            let idx = res.length - 1;
            _id = res[idx].post_id + 1;
        } else _id = 1;
    });
}


app.listen(port, (req, res) => {
    console.log("Server is listening to : ", port);
});


//READ DATA ROUTE
app.get("/", (req, res) => {
    let q1 = "SELECT * FROM imanmay2";
    connection.query(q1, (err, res_) => {
        try {
            if (err) throw err;
            res.render("master.ejs", { data: res_.reverse(), getDate });
        } catch (err) {
            res.send(err);
        }
    });
});



//POSTING DATA IN THE DAIRY--ROUTE.
app.post("/post", (req, res) => {
    if (_id != null) {
        let { post_ } = req.body;
        let q1 = "INSERT INTO imanmay2(post_id,post_date,post_text) VALUES(?,?,?)";
        data_ = [_id, new Date(), post_.toString()];
        _id = _id + 1;
        connection.query(q1, data_, (err, res_) => {
            try {
                if (err) throw err;
                res.redirect("/");
            }
            catch (err) {
                res.send(err);
            }
        })
    } else {
        res.send(err);
    }
});




//EDIT INFORMATION ROUTE.
// app.get("/:id/edit", (req, res) => {
//     res.render("edit.ejs",{data: req.params.id});
// })


//UPDATE INFORMATION ROUTE.
app.post("/:id/update", (req, res) => {
    let { id } = req.params;
    let { data } = req.body;
    val_ = [data, id];
    update("imanmay2","post_text",val_,res);
})


//DELETE POST ROUTE.
app.post("/:id/delete", (req, res) => {
    let q1 = "DELETE FROM imanmay2 WHERE post_id=?";
    let { id } = req.params;
    console.log(req.params);
    connection.query(q1, [parseInt(id,10)], (err, res_) => {
        try {
            if (err) throw err;
            res.redirect("/");
        } catch (err) {
            res.send(err);
        }
    });
});




//SIGNUP ROUTE.
app.get("/signup",(req,res)=>{
    res.render("sign.ejs",{property: "Sign Up"});
});

//SIGNIN ROUTE.
app.get("/signin",(req,res)=>{
    res.render("sign.ejs",{property: "Sign In"});
});



//like
app.get("/:id/like?isLiked=:n",(req,res)=>{
    let {id}=req.params;
    //isLiked -> old data in db
    //we have to know the old data in order to decide whether to pass the 0 or 1 in the update function
    let {n}=req.query;
    update("imanmay2","isLiked",[(n=="1")?0:1,id],res);
});



//bookmark.
app.get("/:id/bookmark?isBookmarked=:n",(req,res)=>{
    let {id}=req.params;
    let {n}=req.query;
    update("imanmay2","isBookmarked",[(n==1)?0:1,id],res);
});



//like
app.get("/:id/like",(req,res)=>{
    let {id}=req.params;
    let {isLiked}=req.query;
    update("imanmay2","isLiked",[(isLiked=="1")?0:1,id],res);
});



//bookmark.
app.get("/:id/bookmark",(req,res)=>{
    let {id}=req.params;
    let {isBookmarked}=req.query;
    update("imanmay2","isBookmarked",[(isBookmarked==1)?0:1,id],res);
});


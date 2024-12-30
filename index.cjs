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

function getDate(date) {
    var date = new Date(date);
    date = date.toString().substring(4, 15);
    date = date.substring(0, 6) + "," + date.substring(6);
    return date.trim();
}


const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    database: DATABASE,
    password: PASSWORD
});



if (connection) {
    connection.query("create table if not exists imanmay2(post_id int(10),post_date date,name varchar(50) default \"Manmay Chakraborty\",post_text text,isBookmarked int(2),isLiked int(2));");
    console.log("CONNECTION IS SUCCESSFUL. ");

    //SETTING UP THE ID. 
    connection.query("select * from imanmay2", (err, res) => {
        let idx = res.length - 1;
        _id = res[idx].post_id + 1;
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
            res.render("master.ejs", { data: res_,getDate });
        } catch (err) {
            res.send(err);
        }
    });
});



//POSTING DATA IN THE DAIRY--ROUTE.
app.post("/post", (req, res) => {
    if (_id != null) {
        let { post_ } = req.body;
        let q1 = "INSERT INTO imanmay2(post_id,post_date,post_text,IsBookmarked,IsLiked) VALUES(?,?,?,?,?)";
        data_ = [_id, new Date(), post_.toString(), 0, 0];
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
app.get("/edit", (req, res) => {
    res.render("edit.ejs");
})


//UPDATE INFORMATION ROUTE.
app.post("/:id/update", (req, res) => {
    let { id } = req.params;
    let { data } = req.body;
    let q1 = "UPDATE imanmay2 SET post_text=? WHERE post_id=?";
    val_ = [data, id];
    connection.query(q1, val_, (err, res_) => {
        try {
            if (err) throw err;
            res.redirect("/");
        } catch (err) {
            res.send(err);
        }
    })
})


//DELETE POST ROUTE.

app.post("/:id/delete", (req, res) => {
    let q1 = "DELETE FROM imanmay2 WHERE post_id=?";
    let { id } = req.params;
    connection.query(q1, [id], (err, res_) => {
        try {
            if (err) throw err;
            res.redirect("/");
        } catch (err) {
            res.send(err);
        }
    });
});
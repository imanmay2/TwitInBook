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
let TOTALPOSTS = 0;
let TOTALLIKES = 0;
let TOTALBOOKMARKS = 0;
let USERNAME = "";
let USERID = "";
let USER_PASSWORD = "";
let isSignedIn = false;

//Function for Date function.
function getDate(date) {
    var date = new Date(date);
    date = date.toString().substring(4, 15);
    date = date.substring(0, 6) + "," + date.substring(6);
    return date.trim();
}

// function for Update command.
function update(table_name, field, dataset, res) {
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
    console.log("CONNECTION IS SUCCESSFUL. ");

}


app.listen(port, (req, res) => {
    console.log("Server is listening to : ", port);
});


//READ DATA ROUTE
app.get("/", (req, res) => {
    if (!isSignedIn) res.redirect("/signin");
    else {
        TOTALBOOKMARKS = 0;
        TOTALLIKES = 0;
        connection.query("SELECT * FROM userdetails", (err, result_) => {
            try {
                if (err) throw err;
                if (USERID != result_[0].userid && USER_PASSWORD != result_[0].password) {
                    res.redirect("/signin");
                } else {
                    USERNAME = result_[0].name;
                }
            } catch (err) {
                res.send(err);
            }
        });
        connection.query(`create table if not exists ${USERID}(post_id int(10),post_date date,name varchar(50) default \"${USERNAME}\",post_text text,isBookmarked int(2) default 0,isLiked int(2) default 0);`);
        let q1 = `SELECT * FROM ${USERID}`;
        connection.query(q1, (err, res_) => {
            if (res_.length > 0) {
                for (let i of res_) {
                    if (i.isBookmarked) {
                        TOTALBOOKMARKS += 1;
                    }
                    i.isLiked ? TOTALLIKES += 1 : TOTALLIKES += 0;
                }
            }
            try {
                if (err) throw err;
                TOTALPOSTS = res_.length;
                if (res_.length > 0) {
                    let idx = res_.length - 1;
                    _id = res_[idx].post_id + 1;
                } else _id = 1;
                res.render("master.ejs", { data: res_.reverse(), TOTALPOSTS: TOTALPOSTS, TOTALBOOKMARKS: TOTALBOOKMARKS, TOTALLIKES: TOTALLIKES, USERNAME: USERNAME, USERID: USERID, getDate });
            } catch (err) {
                res.send(err);
            }
        });
    }

});



//POSTING DATA IN THE DAIRY--ROUTE.
app.post("/post", (req, res) => {
    if (_id != null) {
        let { post_ } = req.body;
        let q1 = `INSERT INTO ${USERID}(post_id,post_date,post_text) VALUES(?,?,?)`;
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
app.post("/update", (req, res) => {
    // let { id } = req.params;
    let { post_id,post_ } = req.body;
    val_ = [post_,post_id];
    update(USERID, "post_text", val_, res);
});


//DELETE POST ROUTE.
app.post("/:id/delete", (req, res) => {
    let q1 = `DELETE FROM ${USERID} WHERE post_id=?`;
    let { id } = req.params;
    connection.query(q1, [parseInt(id, 10)], (err, res_) => {
        try {
            if (err) throw err;
            res.redirect("/");
        } catch (err) {
            res.send(err);
        }
    });
});




//SIGNUP ROUTE.
app.get("/signup", (req, res) => {
    connection.query("create table if not exists userdetails(name varchar(50),userid varchar(50),password varchar(80));");
    res.render("sign.ejs", { property: "Sign Up" });
});

//SIGNIN ROUTE.
app.get("/signin", (req, res) => {
    res.render("sign.ejs", { property: "Sign In" });
});


app.post("/signinup", (req, res) => {
    let { name, userid, password } = req.body;
    if (name == undefined) {
        isSignedIn = true;
        USERID = userid;
        USER_PASSWORD = password
        res.redirect("/");
    } else {
        connection.query("INSERT INTO userdetails VALUES(?,?,?);", [name, userid, password], (err, res_) => {
            try {
                if (err) throw err;
                res.redirect("/");
            } catch (err) {
                res.send(err);
            }
        });
    }
});



//like
app.get("/:id/like", (req, res) => {
    let { id } = req.params;
    let { isLiked } = req.query;
    update(USERID, "isLiked", [(isLiked == "1") ? 0 : 1, id], res);
});



//bookmark.
app.get("/:id/bookmark", (req, res) => {
    let { id } = req.params;
    let { isBookmarked } = req.query;
    update(USERID, "isBookmarked", [(isBookmarked == 1) ? 0 : 1, id], res);
});


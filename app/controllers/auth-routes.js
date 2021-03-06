/**
 * Created by esterlingaccime on 6/20/17.
 */
var db = require("../models"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    express = require("express"),
    router = express.Router(),
    secret = require("../config/secrets"),
    path = require("path");

// router.get("/signup", function (req, res) {
//     res.render("signup", {status: "Create a username and password"});
// });

router.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/../views/index.html"));
});


router.post("/sign-up", function (req, res) {
    bcrypt.genSalt(10, function (err, salt) {
        if(err){
            console.log(err);
        } else{
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if(err) throw err;

                db.user.create({
                    username:req.body.username,
                    password:hash
                })
                    .then(function (data) {
                        res.json(data);
                    })
                    .catch(function (err) {
                        res.json(err);
                    });
            });
        }
    })
});


router.post("/sign-in", function (req, res) {
    db.user.findOne({
        username: req.body.username
    })
        .then(function (user) {
            if(!user){
                res.json("No user found!!");
            } else{
                bcrypt.compare(req.body.password, user.password, function (err, valid) {
                    if(err){
                        res.json("Username or password is incorrect");
                    } else{

                        var token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data:{
                                username: user.username
                            }
                        }, secret);

                        res.json({
                            success:true,
                            message:'Enjoy your token!',
                            token:token
                        });
                    }

                });
            }
        })
        .catch(function (err) {
            res.json(err);
        });
});






module.exports = router;
var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");
const Blog = require("../models/Blog");

/* GET home page. */
router.get("/", function (req, res, next) {
  Category.find({ isDeleted: "0" })
    .select("_id name")
    .exec((err, rtn) => {
      if (err) throw err;
      Blog.aggregate([
        {
          $match: { isDeleted: "0" },
        },
        {
          $group: {
            _id: { categoryId: "$categoryId" },
            data: {
              $push: { id: "$_id", title: "$title", mainImg: "$mainImg" },
            },
          },
        },
      ]).exec((err2, rtn2) => {
        if (err2) throw err2;
        console.log(rtn2[1]);
        res.render("index", {
          title: "Express",
          category: rtn,
          collection: rtn2,
        });
      });
    });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const user = new User();
  const age = Number(req.body.age);
  let ageArrange;
  if (age < 13) {
    ageArrange = "kid";
  } else if (age <= 13 && age < 19) {
    ageArrange = "teenager";
  } else if (age <= 19 && age < 21) {
    ageArrange = "young";
  } else if (age <= 21 && age < 39) {
    ageArrange = "adult";
  } else {
    ageArrange = "old";
  }
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.uname;
  user.password = req.body.password;
  user.age = age;
  user.bmi = req.body.bmi;
  user.gender = req.body.gender;
  user.ageArrange = ageArrange;
  user.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/login");
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  User.findOne(
    { $or: [{ email: req.body.contact }, { username: req.body.contact }] },
    (err, rtn) => {
      console.log(rtn);
      if (err) throw err;
      if (rtn != null && User.compare(req.body.password, rtn.password)) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
});

module.exports = router;

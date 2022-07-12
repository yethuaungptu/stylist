var express = require("express");
const bcrypt = require("bcryptjs");
var router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");
const Blog = require("../models/Blog");
const Shop = require("../models/Shop");

/* GET home page. */
const auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login"); // redirect to other page
  }
};
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
        User.countDocuments({ isDeleted: "0" }).exec((err3, rtn3) => {
          if (err3) throw err3;
          Blog.aggregate(
            [
              {
                $group: {
                  _id: "viewcount",
                  count: { $sum: "$viewCount" },
                },
              },
            ],
            (err4, rtn4) => {
              if (err4) throw err4;
              console.log(rtn4);
              Blog.find({})
                .sort({ viewCount: -1, created: 1 })
                .limit(6)
                .select("mainImg title estPrice")
                .exec((err5, rtn5) => {
                  if (err5) throw err5;
                  Blog.find({})
                    .sort({ viewCount: -1, created: -1 })
                    .limit(10)
                    .select("mainImg title estPrice")
                    .exec((err6, rtn6) => {
                      if (err6) throw err6;
                      res.render("index", {
                        title: "Express",
                        category: rtn,
                        collection: rtn2,
                        userCount: rtn3,
                        viewCount: rtn4,
                        populars: rtn5,
                        trending: rtn6,
                      });
                    });
                });
            }
          );
        });
      });
    });
});

router.get("/men", (req, res) => {
  Blog.find({ isDeleted: "0", $or: [{ gender: "male" }, { gender: "all" }] })
    .select("_id title mainImg estPrice")
    .sort({ created: -1 })
    .exec((err, rtn) => {
      if (err) throw err;
      Category.find({ isDeleted: "0" })
        .select("_id name")
        .exec((err2, rtn2) => {
          if (err2) throw err2;
          res.render("men", { blogs: rtn, collections: rtn2 });
        });
    });
});

router.get("/women", (req, res) => {
  Blog.find({ isDeleted: "0", $or: [{ gender: "female" }, { gender: "all" }] })
    .select("_id title mainImg estPrice")
    .sort({ created: -1 })
    .exec((err, rtn) => {
      if (err) throw err;
      Category.find({ isDeleted: "0" })
        .select("_id name")
        .exec((err2, rtn2) => {
          if (err2) throw err2;
          res.render("women", { blogs: rtn, collections: rtn2 });
        });
    });
});

router.get("/kids", (req, res) => {
  Blog.find({ isDeleted: "0", ageArrange: "kid" })
    .select("_id title mainImg estPrice")
    .sort({ created: -1 })
    .exec((err, rtn) => {
      if (err) throw err;
      Category.find({ isDeleted: "0" })
        .select("_id name")
        .exec((err2, rtn2) => {
          if (err2) throw err2;
          res.render("kid", { blogs: rtn, collections: rtn2 });
        });
    });
});

router.get("/blogdetail/:id", (req, res) => {
  Blog.findById(req.params.id)
    .populate("shopId", "_id name")
    .populate("categoryId", "_id name")
    .exec((err, rtn) => {
      if (err) throw err;
      Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { viewCount: 1 } },
        (err2, rtn2) => {
          if (err2) throw err2;
          res.render("detail", { blog: rtn });
        }
      );
    });
});

router.get("/collections", (req, res) => {
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
              $push: {
                id: "$_id",
                title: "$title",
                mainImg: "$mainImg",
                content: "$content",
                estPrice: "$estPrice",
              },
            },
          },
        },
      ]).exec((err2, rtn2) => {
        if (err2) throw err2;
        res.render("collection", { category: rtn, collection: rtn2 });
      });
    });
});

router.get("/shops", (req, res) => {
  Shop.find({ isDeleted: "0" })
    .select("_id name address pfUrl")
    .exec((err, rtn) => {
      if (err) throw err;
      res.render("shops", { shops: rtn });
    });
});

router.get("/shopdetail/:id", (req, res) => {
  Shop.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    Blog.find({ shopId: req.params.id })
      .sort({ created: -1 })
      .select("_id mainImg title content estPrice")
      .exec((err2, rtn2) => {
        if (err2) throw err2;
        res.render("shopdetail", { shop: rtn, blogs: rtn2 });
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
      if (
        rtn != null &&
        User.compare(req.body.password, rtn.password) &&
        rtn.isDeleted == "0"
      ) {
        req.session.user = { id: rtn._id, name: rtn.name, email: rtn.email };
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    }
  );
});
router.get("/myprofile", auth, (req, res) => {
  User.findById(req.session.user.id, (err, rtn) => {
    if (err) throw err;
    Category.find({ isDeleted: "0" })
      .select("_id name")
      .exec((err2, rtn2) => {
        if (err2) throw err2;

        Blog.aggregate([
          {
            $match: {
              isDeleted: "0",
              $or: [{ gender: rtn.gender }, { gender: "all" }],
              bmi: rtn.bmi,
              ageArrange: rtn.ageArrange,
            },
          },
          {
            $group: {
              _id: { categoryId: "$categoryId" },
              data: {
                $push: {
                  id: "$_id",
                  title: "$title",
                  mainImg: "$mainImg",
                  content: "$content",
                  estPrice: "$estPrice",
                },
              },
            },
          },
        ]).exec((err3, rtn3) => {
          if (err3) throw err3;
          Blog.find({ isDeleted: "0" })
            .sort({ created: -1 })
            .limit(5)
            .select("mainImg")
            .exec((err4, rtn4) => {
              if (err4) throw err4;
              Blog.find({ isDeleted: "0" })
                .sort({ viewCount: -1 })
                .limit(16)
                .select("name estPrice mainImg")
                .exec((err5, rtn5) => {
                  if (err5) throw err5;
                  res.render("myprofile", {
                    user: rtn,
                    category: rtn2,
                    collection: rtn3,
                    newArr: rtn4,
                    trending: rtn5,
                  });
                });
            });
        });
      });
  });
});

router.get("/editmyprofile", auth, (req, res) => {
  User.findById(req.session.user.id, (err, rtn) => {
    if (err) throw err;
    res.render("editmyprofile", { user: rtn });
  });
});

router.post("/editmyprofile", auth, (req, res) => {
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
  let update = {
    name: req.body.name,
    age: age,
    ageArrange: ageArrange,
    bmi: req.body.bmi,
    gender: req.body.gender,
  };
  if (req.body.password != "")
    update.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(8),
      null
    );
  User.findByIdAndUpdate(req.session.user.id, { $set: update }, (err, rtn) => {
    if (err) throw err;
    res.redirect("/myprofile");
  });
});

router.get("/recomandshop", auth, (req, res) => {
  User.findById(req.session.user.id, (err, rtn) => {
    if (err) throw err;
    Shop.aggregate(
      [
        {
          $sample: { size: 10 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            address: 1,
            pfUrl: 1,
          },
        },
      ],
      (err2, rtn2) => {
        if (err2) throw err2;
        res.render("recommandshop", { user: rtn, shops: rtn2 });
      }
    );
  });
});

router.get("/logout", auth, (req, res) => {
  req.session.destroy((err, data) => {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = router;

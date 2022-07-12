var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "public/images/uploads" });
const Shop = require("../models/Shop");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const Blog = require("../models/Blog");
const User = require("../models/User");

const auth = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login"); // redirect to other page
  }
};

const cpUpload = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

const blogUpload = upload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "moreImg", maxCount: 3 },
]);
/* GET users listing. */
router.get("/", auth, function (req, res, next) {
  Blog.countDocuments({ isDeleted: "0" }, (err, rtn) => {
    if (err) throw err;
    Shop.countDocuments({ isDeleted: "0" }, (err2, rtn2) => {
      if (err2) throw err2;
      Category.countDocuments({ isDeleted: "0" }, (err3, rtn3) => {
        if (err3) throw err3;
        User.countDocuments({ isDeleted: "0" }, (err4, rtn4) => {
          if (err4) throw err4;
          res.render("admin/index", {
            blog: rtn,
            shop: rtn2,
            category: rtn3,
            user: rtn4,
          });
        });
      });
    });
  });
});

router.get("/register", (req, res) => {
  res.render("admin/register");
});

router.post("/register", (req, res) => {
  const admin = new Admin();
  admin.name = req.body.username;
  admin.email = req.body.email;
  admin.password = req.body.password;
  admin.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/login");
  });
});

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.post("/login", (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, rtn) => {
    if (err) throw err;
    if (rtn != null && Admin.compare(req.body.password, rtn.password)) {
      req.session.admin = {
        name: rtn.name,
        email: rtn.email,
        id: rtn._id,
      };
      res.redirect("/admin");
    } else {
      res.redirect("/admin/login");
    }
  });
});

router.get("/logout", auth, (req, res) => {
  req.session.destroy((err, data) => {
    if (err) throw err;
    res.redirect("/admin");
  });
});

router.get("/shopadd", auth, (req, res) => {
  res.render("admin/shopadd");
});

router.post("/shopadd", cpUpload, auth, (req, res) => {
  const shop = new Shop();
  shop.name = req.body.name;
  shop.address = req.body.address;
  shop.phone = req.body.phone;
  shop.pfUrl = "/images/uploads/" + req.files.profile[0].filename;
  shop.bgUrl = "/images/uploads/" + req.files.background[0].filename;
  shop.createdBy = req.session.admin.id;
  shop.updatedBy = req.session.admin.id;
  shop.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/shoplist");
  });
});

router.get("/shoplist", auth, (req, res) => {
  Shop.find({ isDeleted: "0" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/shoplist", { shops: rtn });
  });
});

router.get("/shopupdate/:id", auth, (req, res) => {
  Shop.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    res.render("admin/shopupdate", { shop: rtn });
  });
});

router.post("/shopupdate", cpUpload, auth, (req, res) => {
  Shop.findById(req.body.uid)
    .select("pfUrl bgUrl")
    .exec((err, rtn) => {
      if (err) throw err;
      const path = "public/";
      let update = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        updatedBy: req.session.admin.id,
        updated: Date.now(),
      };
      if (req.files.profile) {
        try {
          fs.unlinkSync(path + rtn.pfUrl);
          update.pfUrl = "/images/uploads/" + req.files.profile[0].filename;
        } catch (error) {
          console.log("Image delete error");
        }
      }
      if (req.files.background) {
        try {
          fs.unlinkSync(path + rtn.bgUrl);
          update.bgUrl = "/images/uploads/" + req.files.background[0].filename;
        } catch (error) {
          console.log("Image delete error");
        }
      }
      console.log(update);
      Shop.findByIdAndUpdate(req.body.uid, { $set: update }, (err2, rtn2) => {
        if (err2) throw err2;
        res.redirect("/admin/shoplist");
      });
    });
});

router.post("/shopdelete", auth, (req, res) => {
  const update = {
    isDeleted: "1",
    updatedBy: req.session.admin.id,
    updated: Date.now(),
  };
  Shop.findByIdAndUpdate(req.body.id, { $set: update }, (err, rtn) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      console.log(rtn);
      res.json({
        status: "done",
      });
    }
  });
});

router.get("/categoryadd", auth, (req, res) => {
  res.render("admin/category-add");
});

router.post("/categoryadd", auth, (req, res) => {
  const category = new Category();
  category.name = req.body.name;
  category.createdBy = req.session.admin.id;
  category.updatedBy = req.session.admin.id;
  category.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/categorylist");
  });
});

router.get("/categorylist", auth, (req, res) => {
  Category.find({ isDeleted: "0" })
    .populate("createdBy", "name")
    .populate("updatedBy", "name")
    .exec((err, rtn) => {
      if (err) throw err;
      res.render("admin/category-list", { categories: rtn });
    });
});

router.post("/categoryupdate", auth, (req, res) => {
  const update = {
    name: req.body.name,
    updatedBy: req.session.admin.id,
    updated: Date.now(),
  };
  console.log(req.body);
  Category.findByIdAndUpdate(req.body.id, { $set: update }, (err, rtn) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      console.log(rtn);
      res.json({
        status: "done",
      });
    }
  });
});

router.post("/categorydelete", auth, (req, res) => {
  const update = {
    isDeleted: "1",
    updatedBy: req.session.admin.id,
    updated: Date.now(),
  };
  Category.findByIdAndUpdate(req.body.id, { $set: update }, (err, rtn) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      console.log(rtn);
      res.json({
        status: "done",
      });
    }
  });
});

router.get("/blogadd", auth, (req, res) => {
  Shop.find({ isDeleted: "0" })
    .select("_id name pfUrl")
    .exec((err, rtn) => {
      if (err) throw err;
      Category.find({ isDeleted: "0" })
        .select("_id name")
        .exec((err2, rtn2) => {
          if (err2) throw err2;
          res.render("admin/blog-add", { shops: rtn, categories: rtn2 });
        });
    });
});

router.post("/blogadd", blogUpload, auth, (req, res) => {
  const blog = new Blog();
  blog.title = req.body.title;
  blog.content = req.body.content;
  blog.shopId = req.body.shop;
  blog.categoryId = req.body.category;
  blog.ageArrange = req.body.ageArrange;
  blog.bmi = req.body.bmi;
  blog.size = req.body.size;
  blog.gender = req.body.gender;
  blog.estPrice = req.body.price;
  if (req.files.mainImg[0].filename)
    blog.mainImg = "/images/uploads/" + req.files.mainImg[0].filename;
  let gallery = [];
  for (let i = 0; i < req.files.moreImg.length; i++) {
    gallery.push("/images/uploads/" + req.files.moreImg[i].filename);
  }
  blog.moreImg = gallery;
  blog.createdBy = req.session.admin.id;
  blog.updatedBy = req.session.admin.id;
  blog.created = Date.now();
  blog.updated = Date.now();
  blog.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/bloglist");
  });
});

router.get("/bloglist", auth, (req, res) => {
  Blog.find({ isDeleted: "0" })
    .populate("categoryId", "name")
    .populate("createdBy", "name")
    .populate("updatedBy", "name")
    .sort({ created: -1 })
    .exec((err, rtn) => {
      if (err) throw err;
      res.render("admin/blog-list", { blogs: rtn });
    });
});

router.get("/blogdetail/:id", auth, (req, res) => {
  Blog.findById(req.params.id)
    .populate("categoryId", "name")
    .populate("shopId", "name")
    .exec((err, rtn) => {
      if (err) throw err;
      res.render("admin/blog-detail", { blog: rtn });
    });
});

router.get("/blogupdate/:id", auth, (req, res) => {
  Shop.find({ isDeleted: "0" })
    .select("_id name pfUrl")
    .exec((err, rtn) => {
      if (err) throw err;
      Category.find({ isDeleted: "0" })
        .select("_id name")
        .exec((err2, rtn2) => {
          if (err2) throw err2;
          Blog.findById(req.params.id, (err3, rtn3) => {
            if (err3) throw err3;
            res.render("admin/blog-update", {
              shops: rtn,
              categories: rtn2,
              blog: rtn3,
            });
          });
        });
    });
});

router.post("/blogupdate", blogUpload, auth, (req, res) => {
  Blog.findById(req.body.uid)
    .select("moreImg mainImg")
    .exec((err, rtn) => {
      if (err) throw err;
      const path = "public/";
      let update = {
        title: req.body.title,
        content: req.body.content,
        shopId: req.body.shop,
        categoryId: req.body.category,
        ageArrange: req.body.ageArrange,
        bmi: req.body.bmi,
        estPrice: req.body.price,
        size: req.body.size,
        gender: req.body.gender,
        updatedBy: req.session.admin.id,
        updated: Date.now(),
      };
      if (req.files.mainImg) {
        try {
          fs.unlinkSync(path + rtn.mainImg);
          update.mainImg = "/images/uploads/" + req.files.mainImg[0].filename;
        } catch (error) {
          console.log("Image delete error");
        }
      }
      if (req.files.moreImg) {
        let gallery = [];
        for (let i = 0; i < req.files.moreImg.length; i++) {
          gallery.push("/images/uploads/" + req.files.moreImg[i].filename);
        }
        update.moreImg = gallery;
        try {
          rtn.moreImg.forEach((file) => {
            fs.unlinkSync(path + file);
          });
        } catch (error) {
          console.log("More Image delete error");
        }
      }
      Blog.findByIdAndUpdate(req.body.uid, { $set: update }, (err2, rtn2) => {
        if (err2) throw err2;
        res.redirect("/admin/bloglist");
      });
    });
});

router.post("/blogdelete", auth, (req, res) => {
  Blog.findByIdAndUpdate(
    req.body.id,
    { $set: { isDeleted: "1" } },
    (err, rtn) => {
      if (err) {
        res.json({
          status: "error",
        });
      } else {
        res.json({
          status: "done",
        });
      }
    }
  );
});

router.get("/users", auth, (req, res) => {
  User.find((err, rtn) => {
    if (err) throw err;
    res.render("admin/user-list", { users: rtn });
  });
});
router.post("/changeuser", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.id,
    { $set: { isDeleted: req.body.status } },
    (err, rtn) => {
      if (err) {
        res.json({
          status: "error",
        });
      } else {
        res.json({
          status: "done",
        });
      }
    }
  );
});

module.exports = router;

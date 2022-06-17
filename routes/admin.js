var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/uploads" });
const Shop = require("../models/Shop");
const Admin = require("../models/Admin");

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
/* GET users listing. */
router.get("/", auth, function (req, res, next) {
  res.render("admin/index");
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

router.get("/shopadd", (req, res) => {
  res.render("admin/shopadd");
});

router.post("/shopadd", cpUpload, (req, res) => {
  const shop = new Shop();
  shop.name = req.body.name;
  shop.address = req.body.address;
  shop.phone = req.body.phone;
  shop.pfUrl = "/images/uploads/" + req.files.profile[0].filename;
  shop.bgUrl = "/images/uploads/" + req.files.background[0].filename;
  shop.save((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/shoplist");
  });
});

router.get("/shoplist", (req, res) => {
  Shop.find((err, rtn) => {
    if (err) throw err;
    res.render("admin/shoplist", { shops: rtn });
  });
});

module.exports = router;

var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/images/uploads" });
const Shop = require("../models/Shop");

const cpUpload = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("admin/index");
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

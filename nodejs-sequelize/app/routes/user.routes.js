
const router = require("express").Router();
const usersController = require("../controllers/user.controller.js");

//TEST
router.get("/", usersController.hello);

router.get("/404", (req, res) =>{res.render("404");});
router.get("/500", (req, res) =>{res.render("500");});

//login form
router.get("/login", usersController.login);
router.post("/login", usersController.handlingLogin);

router.post("/logout", usersController.logout);

//LIST USER
router.get("/list", usersController.listUser);

//ADD NEW USER
router.get('/add', usersController.addRender);
router.post('/add', usersController.addUser);

//Edit
router.get("/edit/:id", usersController.editRender);
router.post("/edit", usersController.editUser);

//Deleted
router.get("/delete/:id", usersController.deleteUser);


module.exports = router
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require("../models");
const User = db.users;

// function abc(req, res)  {
//     User.findAll().then(function(data) {
//         console.log('Data: ', data);
//     }).catch(function(err) {
//         console.log('err: ', err);
//     })
// }
// console.log('findAll: ', abc());

exports.hello = (req, res) => {
    res.json({
        message: "Hello World"
    });
}

//LIST USER
exports.listUser = (req, res, next) => {

    User.findAll()
        .then(data => {
            verify(req, res, next);
            // res.send(data);
            res.render("list", {
                result: data,
                nameUser: loginSucc.toString(),
            });
        })
        .catch(err => {
            res.status(500).send({
                message11: err.message
            });
        });
}

let loginSucc = [];
//Login
module.exports.login = function (req, res, next) {
    res.render("login");
}
//Handling Login
module.exports.handlingLogin = async (req, res) => {

    const user = await User.findOne({
        where: {
            username: req.body.txtUsername
        }
    });
    if (!user) return res.status(400).send('Username is not found');

    //PASSWORD IS CORRECT
    const validate = await bcrypt.compare(req.body.txtPassword, user.password);
    if (!validate) return res.status(400).send('Invalid password');

    //Create and assign a token
    const payload = {
        Username: req.body.txtUsername,
        Password: req.body.txtPassword
    }
    loginSucc.push(req.body.txtUsername);
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    pushToken.push(token);
    console.log('Token: ', token)
    return res.redirect("./list");
}

//ADD NEW USER
exports.addRender = function (req, res, next) {
    res.render("add");
}
exports.addUser = (req, res) => {
    // res.json({haaa: "add"});
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.json({
                "error": true,
                "errMsg": "A Multer error occurred when uploading."
            })
        } else if (err) {
            res.json({
                "error": true,
                "errMsg": "An unknown error occurred when uploading." + err
            })
        } else {
            console.log("Upload is okay");
            //Hash passwords
            const slat = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.txtPassword, slat);
            console.log("pushHash Pass: ", hashedPassword);

            const user = {
                // student_id: uuidv4(),
                // id: 126,
                username: req.body.txtUsername,
                password: hashedPassword,
                email: req.body.txtEmail,
                image: req.file.filename,
            }
            User.create(user)
                .then(data => {
                    res.redirect("./list");
                })
                .catch(err => {
                    console.log('err 123: ', err.message);

                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Tutorial."
                    });
                });
        }
    });
}

//DELETE USER
exports.deleteUser = function (req, res) {
    const id = req.params.id;
    User.destroy({
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.redirect("../list");
            } else {
                res.redirect("../404");
            }
        })
        .catch(err => {
            res.redirect("../500");
        });
}

//Edit USER
module.exports.editRender = function (req, res) {
    const id = req.params.id;
    User.findByPk(id)
        .then(data => {
            // res.send(data);
            res.render("edit", {
                result: data
            });
        })
        .catch(err => {
            console.log('err editRender: ', err)
        });
}
exports.editUser = function (req, res) {
    upload(req, res, function (err) {
        if (!req.file) {
            console.log("Upload is okay --koupload file");
            const _id = req.body.IDChar;
            console.log('id editUser: ', _id)
            const user = {
                username: req.body.txtUsername,
                password: req.body.txtPassword,
                email: req.body.txtEmail,
            }
            User.update(user, {
                    where: {
                        id: _id
                    }
                })
                .then(num => {
                    if (num == 1) {
                        res.redirect("../list");
                    } else {
                        res.redirect("../404");
                    }
                })
                .catch(err => {
                    res.redirect("../500");
                });
        } else {
            if (err instanceof multer.MulterError) {
                res.json({
                    "error": true,
                    "errMsg": "A Multer error occurred when uploading."
                })
            } else if (err) {
                res.json({
                    "error": true,
                    "errMsg": "An unknown error occurred when uploading." + err
                })
            } else {
                console.log("Upload is okay");
                const _id = req.body.IDChar;
                console.log('id editUser: ', _id)

                const user = {
                    username: req.body.txtUsername,
                    password: req.body.txtPassword,
                    email: req.body.txtEmail,
                    image: req.file.filename,
                }
                User.update(user, {
                        where: {
                            id: _id
                        }
                    })
                    .then(num => {
                        if (num == 1) {
                            res.redirect("../list");
                        } else {
                            res.redirect("../404");
                        }
                    })
                    .catch(err => {
                        res.redirect("../500");
                    });
            }
        }
    })

}

exports.logout = function (req, res, next) {
    while (pushToken.length > 0 || loginSucc > 0) {
        pushToken.pop();
        loginSucc.pop();
    }
    res.redirect('./login');
};

let pushToken = [];
function verify(req, res, next) {
    const token = pushToken.toString();
    console.log('----token: ', token)
    //Access Denied
    if (!token) return res.redirect('./login');
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        //Invalid Token
        res.redirect('./login');
    }
}

//Images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'app/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("userImage");
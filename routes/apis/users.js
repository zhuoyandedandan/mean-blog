var Users = require('../../models/users');
var crypto = require('crypto');
var MD5 = function(text) {
    text = text + '';
    return crypto.createHash('md5').update(text).digest('hex');
};

var usersRoute = function(router) {
    router.post('/users/login', function(req, res) {
        //接受前台传入的数据
        var username = req.body.username,
            password = req.body.password;

        var data = {
            result: false,
        };

        var users = {
            username: username,
            password: MD5(MD5(password + '') + username),
        };

        Users.findOne(users, function(err, docs) {
            if (err) {
                console.log(err);
                return handleError(err);
            }
            if (docs) {
                data.result = true;
                req.session.users = users;
                res.status(200).json(data);
            } else {
                res.status(200).json(data);
            }
        });
    });

    router.get('/users', function(req, res, next) {
        var data = {
            title: '主页',
            users: req.session.users,
        }
        res.status(200).json(data);
    });

    router.get('/users/logout', function(req, res, next) {
        req.session.users = null;
        var data = {
            title: '主页',
            users: req.session.users,
        }
        res.status(200).json(data);
    });

    router.post('/users/reg', function(req, res) {
        //接受前台传入的数据
        var username = req.body.username,
            password = req.body.password,
            email = req.body.email;

        var data = {
            reason: null,
            result: false
        };

        //判断前台传入的用户名是否已经存在
        var condition = {
            username: username
        };
        Users.findOne(condition, function(err, docs) {
            if (err) {
                console.log(err);
                return handleError(err);
            }
            if (docs) {
                data.result = "用户名已存在";
                data.reason = 'username';
                res.status(200).json(data);
                return;
            } else {
                //判断前台传入的email是否已经存在
                condition = {
                    email: email
                };
                Users.findOne(condition, function(err, docs) {
                    if (err) {
                        console.log(err);
                        return handleError(err);
                    }
                    if (docs) {
                        data.result = "邮箱已被使用";
                        data.reason = 'email';
                        res.status(200).json(data);
                        return;
                    } else {
                        //若不存在则存入数据库中
                        var users = new Users({
                            username: username,
                            password: MD5(MD5(password + '') + username),
                            email: email
                        });

                        Users.create(users, function(err) {
                            if (err) {
                                console.log(err);
                                return handleError(err);
                            } else {
                                data.result = true;
                                req.session.users = users;
                                res.status(200).json(data);
                                return;
                            }
                        });
                    }
                });
            }
        });

    });

    router.post('/users/check', function(req, res) {
        var condition = {};
        condition[req.body.field] = req.body.value;
        var data = {
            isUnique: false
        };
        Users.findOne(condition, function(err, docs) {
            if (err) {
                console.log(err);
                return handleError(err);
            }
            if (!docs) {
                data.isUnique = true;
            }
            res.status(200).json(data);
            return;
        });
    });
}

module.exports = usersRoute;
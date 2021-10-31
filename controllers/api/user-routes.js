const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


//GET /api/users
router.get('/', (rex, res) => {
    //access user model with findAll
    User.findAll({
        attributes: { exclude: ['password']},
    }).then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({ message: 'No comment found with matching id'});
            return;
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
        
//GET a single user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: require.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
        //Comment model
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
                model: Post,
                attributes: ['title']
            }
        }    
        ]
        }).then(dbCommentData => {
            if(!dbCommentData) {
                res.status(404).json({ message: 'No comment found with matching id'});
                return;
            }
            res.json(dbCommentData);
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
    });
});

//CREATE new user
router.post('/', withAuth, (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    //store user data during session
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    });
});

//LOG In for users and verification
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with matching email address.'});
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password.' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'Login successful.'});
        });
    });
});


//export
module.exports = router;
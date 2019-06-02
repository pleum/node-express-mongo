const router = require('express').Router();
const { connectMongo } = require('../utils');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb')

const secret = 'HELLOWORLD';

router.get('/', async (req, res) => {
    const client = await connectMongo();
    const user = await client
        .db('auth_local')
        .collection('users')
        .findOne({});

    res.json(user);
});

router.get('/profile', async (req, res) => {
    const { token } = req.body;

    if (token == null) {
        res.status(400).json({ message: 'token is required!' });
    }

    var payload = jwt.verify(token, secret);
    const { _id } = payload;

    console.log(_id)

    const client = await connectMongo();

    const user = await client
        .db('auth_local')
        .collection('users')
        .findOne({ _id: new ObjectID(_id) });

    res.json(user);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username == null) {
        res.status(400).json({ message: 'username is required!' });
    }

    if (password == null) {
        res.status(400).json({ message: 'password is required!' });
    }

    const client = await connectMongo();

    const userAuth = {
        username,
        password: md5(password)
    };

    const user = await client
        .db('auth_local')
        .collection('users')
        .findOne(userAuth);

    if (user == null) {
        res.status(404).json({ message: 'user not found' });
        return;
    }

    const token = jwt.sign({ _id: user._id }, secret);
    res.json({ token });
});

router.post('/create', async (req, res) => {
    const { username, password, age } = req.body;

    if (username == null) {
        res.status(400).json({ message: 'username is required!' });
    }

    if (password == null) {
        res.status(400).json({ message: 'password is required!' });
    }

    if (age == null) {
        res.status(400).json({ message: 'age is required!' });
    }

    const client = await connectMongo();

    const user = {
        username,
        password: md5(password),
        age: parseInt(age) // String to Int.
    };

    await client
        .db('auth_local')
        .collection('users')
        .insertOne(user);

    res.json({ message: 'succeed' });
});

module.exports = router;

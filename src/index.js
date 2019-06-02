const express = require('express');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser())

const routes = require('./routes');

app.use('/user', routes.userRouter);

app.listen(8080, async () => {
    console.log('Listening on port: 8080');
});

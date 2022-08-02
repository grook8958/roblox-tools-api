const express = require('express');
const RobloxUser = require('./RobloxUser');
const app = express();
const port = 33000

app.get('/', function(req, res) {
    res.send({
        status: 200,
        message: "ok"
    })
})

app.get('/username/*', async (req, res) => {
    const username = req.url.replace('/username', '').replace('/', '')
    
    const user = new RobloxUser(username);

    let error;
    await user.search()
        .catch(err => {
            error = err;
        });
    if (error) {
        return res.header('Access-Control-Allow-Origin', '*').send({
            status: 403,
            message: error,
        })
    }
    
    res.header('Access-Control-Allow-Origin', '*').send({
        status: 200,
        message: "ok",
        data: {
            ...user.toJSON()
        }
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
const express = require('express');
const RobloxUser = require('./RobloxUser');
const APIResponse = require('./APIResponse');
const app = express();
const port = 3000
// GET 
app.get('/', function(req, res) {
    return new APIResponse(req, res).new(undefined, 200, 'ok');
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
        return new APIResponse(req, res).error(403, error);
    }
    return new APIResponse(req, res).new(user.toJSON(), 200, 'ok');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
})

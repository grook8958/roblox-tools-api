class APIResponse {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    new(data = {}, statusCode, message) {
        return this.res.header('Access-Control-Allow-Origin', '*').send({
            status: statusCode,
            message,
            data
        })
    }

    error(statusCode, errorMessage) {
        return this.res.header('Access-Control-Allow-Origin', '*').send({
            status: statusCode,
            error: errorMessage
        })
    }
}

module.exports = APIResponse;
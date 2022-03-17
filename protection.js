const fetch = require('isomorphic-fetch');
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const API_KEY = process.env.API_KEY;

const checkRecaptcha = (req, res, next) => {
    const { token } = req.body;
    const api_key = req.get('x-api-key');
    if (!token && api_key) return next();
    if (!token) return res.status(400).json('Invalid request');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`;
    fetch(url, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => {
            if (google_response.success === true) return next();
            return res.status(400).json('Invalid request');
        })
        .catch(error => {
            return res.json('Invalid request').redirect('/');
        });
};

const checkApiKey = (req, res, next) => {
    const { token } = req.body;
    if(token) return next();
    const api_key = req.get('x-api-key');
    if(api_key === API_KEY) return next();
    else return res.status(400).json('Invalid request');
};

module.exports = {
    checkRecaptcha,
    checkApiKey
};

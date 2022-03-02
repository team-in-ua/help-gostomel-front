const AWS = require('aws-sdk');
const fs = require('fs');
const { uuid } = require('uuidv4');
const UserSchema = require('../data_db/user_data_db');
const LOLKEK = process.env.SECRET;
const LOLKEK4EBUREK = process.env.ACCESS;
const SUBDATA = process.env.BCKTNM;
const s3 = new AWS.S3({
    accessKeyId: LOLKEK,
    secretAccessKey: LOLKEK4EBUREK
});
const uploadUser = async (req, res) => {
    const saveUserToDb = async (data) => {
        const user = await UserSchema.create(data);
    };
    const { fname, lname, mname, phone_numbers, additionaltext } = req.body;
    if(req.file) {
        const img = fs.readFileSync(req.file.path);
        const params = {
            Bucket: SUBDATA,
            Key: `${uuid()}/${req.file.originalname}`,
            Body: img
        };
        s3.upload(params, async (err, data) => {
            fs.unlinkSync(req.file.path);
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            saveUserToDb({
                first_name: fname,
                last_name: lname,
                middle_name: mname,
                phone_numbers,
                additionaltext,
                picture: data.Location
            });
        });
        return res.redirect('/');
    }
    saveUserToDb({
        first_name: fname,
        last_name: lname,
        middle_name: mname,
        phone_numbers,
        additionaltext,
        picture: null
    });
    return res.redirect('/');
}

const retrieveData = async (req, res) => {
    const users = await UserSchema.findAll();
    return res.json(users);
}

module.exports = {
    uploadUser,
    retrieveData
}
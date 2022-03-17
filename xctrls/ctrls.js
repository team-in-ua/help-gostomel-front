const AWS = require('aws-sdk');
const fs = require('fs');
const { uuid } = require('uuidv4');
const { Op } = require('sequelize');
const sharp = require("sharp");
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
        return res.redirect('/');
    };
    const { fname, lname, mname, phone_numbers, additionaltext, recfile } = req.body;
    if (req.file) {
        const img = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path);
        const params = {
            Bucket: SUBDATA,
            Key: `${uuid()}/${req.file.originalname}`,
            Body: img
        };
        s3.upload(params, async (err, data) => {
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
    } else if (recfile) {
        const folderPath = 'uploads/images';
        const originalname = `${uuid()}.png`;
        const target_path = `${folderPath}${originalname}`;
        const uri = recfile.split(';base64,').pop();
        const fileBuffer = Buffer.from(uri, 'base64');

        await sharp(fileBuffer)
            .png()
            .toFile(target_path);

        const file = fs.readFileSync(target_path);
        fs.unlinkSync(target_path);
        const params = {
            Bucket: SUBDATA,
            Key: originalname,
            Body: file
        };
        s3.upload(params, async (err, data) => {
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
    } else {
        saveUserToDb({
            first_name: fname,
            last_name: lname,
            middle_name: mname,
            phone_numbers,
            additionaltext,
            picture: null
        });
    }
}

const retrieveData = async (req, res) => {
    const users = await UserSchema.findAll();
    return res.json(users);
}

const search = async (req, res) => {
    const { searchPattern } = req.body;
    if(!searchPattern) return res.status(400);
    const queryClause = searchPattern.split(' ');
    let users;
    if(queryClause.length === 1) {
        users = await UserSchema.findAll(
            {
                where:
                {
                    [Op.or]: {
                        first_name: {
                            [Op.like]: `%${queryClause[0]}%`
                        },
                        last_name: {
                            [Op.like]: `%${queryClause[0]}%`
                        },
                    }
                }
            }
        );
    } else if (queryClause.length > 1) {
        users = await UserSchema.findAll(
            {
                where:
                {
                    [Op.or]: {
                        first_name: {
                            [Op.like]: `%${queryClause[0]}%`
                        },
                        first_name: {
                            [Op.like]: `%${queryClause[1]}%`
                        },
                        last_name: {
                            [Op.like]: `%${queryClause[0]}%`
                        },
                        last_name: {
                            [Op.like]: `%${queryClause[1]}%`
                        }
                    }
                }
            }
        );
    }
    return res.json(users);
}

module.exports = {
    uploadUser,
    retrieveData,
    search
}
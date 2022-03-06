const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASS,
    },
});

const FROM = 'help-gostomel';
const TO = process.env.MAIL_TO;

const sendPeopleInfo = (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json('Text couldnt be empty');
    const SUBJECT = `Информация о найденом человеке`;
    const mailOptions = {
        from: FROM,
        to: TO,
        subject: SUBJECT,
        html: text
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(info);
        }
    });
};

const sendHelpNeeded = (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json('Text couldnt be empty');
    const SUBJECT = `Необходима помощь`;
    const mailOptions = {
        from: FROM,
        to: TO,
        subject: SUBJECT,
        html: text
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(info);
        }
    });
};

module.exports = {
    sendPeopleInfo,
    sendHelpNeeded
};

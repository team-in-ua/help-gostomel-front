const bodyParser = require('body-parser');
const express = require('express');
const multer  = require('multer');
const { checkRecaptcha, checkApiKey } = require('./protection');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { uploadUser, retrieveData, search } = require('./xctrls/ctrls');
const { sendPeopleInfo, sendHelpNeeded } = require('./xctrls/emailctrl');

app.use(express.static("front"));
const upload = multer({dest: __dirname + '/uploads/images'});

app.post('/upload', upload.single('recfile'),checkRecaptcha, checkApiKey, uploadUser);
app.get('/retrieve', retrieveData);
app.post('/people-info', checkRecaptcha, checkApiKey, sendPeopleInfo);
app.post('/help-needed', checkRecaptcha, checkApiKey, sendHelpNeeded);
app.post('/search', checkRecaptcha, checkApiKey, search);
app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});

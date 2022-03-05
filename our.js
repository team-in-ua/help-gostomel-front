const bodyParser = require('body-parser');
const express = require('express');
const multer  = require('multer');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { uploadUser, retrieveData, search } = require('./xctrls/ctrls');

app.use(express.static("front"));
const upload = multer({dest: __dirname + '/uploads/images'});

app.post('/upload', upload.single('recfile'), uploadUser);
app.get('/retrieve', retrieveData);
app.post('/search', search);
app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});

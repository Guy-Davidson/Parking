const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1'

const app = express();
const upload = multer()
const rekognition = new AWS.Rekognition({region: 'eu-west-1'});

app.set('view engine', 'ejs')

app.get('/', (req, res) => {    
    res.render('index')
})

app.post('/upload', upload.single('image'), (req, res) => {    
    const params = {Image: {Bytes: req.file.buffer}}
    rekognition.detectText(params, (err, data) => {
        if (err) console.log(err, err.stack)
        else {
            console.log(data)                       
            res.render('./entry', {
                number: Math.random()
            })
            return 
        }   
      });    
})

app.post('/entry', (req, res) => {
    console.log(req.query);
    res.send('greatest')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)  
})













// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     next();
//   });

// app.use(express.urlencoded({extended: true}))
// app.use(express.json())
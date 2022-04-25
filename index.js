const fs = require('fs')
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1'

const app = express();
const upload = multer()
const rekognition = new AWS.Rekognition({region: 'eu-west-1'});
const db = require('mongoose');
const Plate = require('./plateModel')

app.set('view engine', 'ejs')

app.get('/', (req, res) => {    
    res.render('index')
})

app.post('/upload', upload.single('image'), (req, res) => {    
    const params = {Image: {Bytes: req.file.buffer}}
    rekognition.detectText(params, async (err, data) => {
        if (err) console.log(err, err.stack)
        else {
            let plateText = ''
            for(const text of data.TextDetections) {
                if(text.Type === 'LINE' && text.DetectedText.match(/\d+/g) && text.DetectedText.length > plateText.length) {
                    plateText = text.DetectedText
                }
            }    
            
            const plate = await Plate.find({ text: plateText })

            if(!plate.length) {
                res.render('./entry', { plate: plateText })
            } else {
                res.render('./exit', { ticket: plate[0]._id.toString() })
            }
        }   
      });    

})

app.post('/entry', async(req, res) => {
    try {
        const plate = new Plate({               
            text: req.query.plate.slice(1, (req.query.plate.length - 1)),
            parkingLot: '123',
        })      
        let result = await plate.save();                                         
        res.send({
            ticketId: result._id
        })
    } catch (error) {
        handleError(error); 
    } 
})

app.post('/exit', async(req, res) => {
    try {                          
        ticketId = req.query.ticketId.slice(1, (req.query.ticketId.length - 1))
        const plate = await Plate.findOneAndDelete({ _id: ticketId })                  
        const minDiff = (Date.now() - plate.createdAt) / 1000 / 60
        const price = Math.floor(minDiff / 15) * 2.5 

        res.send({
            licensePlate: plate.text,
            parkingLot: plate.parkingLot,
            totalParkedTime: `${minDiff.toFixed(2)} minutes`,
            price: `${price}$`
        })        
    } catch (error) {
        handleError(error); 
    } 
})

const PORT = process.env.PORT || 5000

const handleError = (err) => {
    console.log(err);
}

fs.readFile('../mongodbKey.txt', 'utf8' , (err, data) => {
    if (err) console.error(err)
    else {
        db.connect(data).then(() => {
            console.log(`connected to db`)
            app.listen(PORT, () => {
              console.log(`Server running on port ${PORT}`)  
            }) 
          }).catch((error) => {
            console.log(error)
          })
    }             
  })
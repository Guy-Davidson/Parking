const express = require('express');

const app = express();

// app.use(express.urlencoded({extended: true}))
// app.use(express.json())

// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     next();
//   });

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)  
})
const connectToMongo = require('./db')
const express = require('express')
const multer = require('multer')
const path = require('path')
var cors = require('cors')


connectToMongo();

const app = express()
const port = 5000

// app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.set("view engine", "ejs");

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/images', require('./routes/images'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/upload', (req, res) => {
    res.render("upload")
})

app.post('/upload', upload.single("image"), (req, res) => {
    res.send("Image Uploaded")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
require("dotenv").config()
const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const File = require("./models/File")

const express = require("express")
const app = express()
app.use(express.urlencoded({ extended: true }))

const upload = multer({ dest: "uploads" })

mongoose.connect(process.env.DATABASE_URL)

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})

app.post('/upload', upload.single('file'), async (req, res) => {
  try {

    let fileObject = {
      path: req.file.path,
      orignalName: req.file.originalname
    }

    //store password hash if password
    if (req.body.password != null || req.body.password !== '') {
      fileObject.password = await bcrypt.hash(req.body.password, 10);
    }


    //store info on db
    let result = await File.create(fileObject);


    //redirect to '/' with file-link
    res.render('index', { filelink: `${req.headers.origin}/file/${result.id}` })

  } catch (err) {
    res.send(err);
  }
})

//create download file link API 
app.route('/file/:id').get(filedownloadhandle).post(filedownloadhandle)

//check if password

//implement the password logic !


async function filedownloadhandle(req, res) {
  let id = req.params.id;
  let file = await File.findById(id);
  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password")
      return
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true })
      return
    }
  }

  file.count++;
  await file.save();

  res.download(file.path, file.orignalName);


}


// another route to see all files avaible online

// route to delete some of files {post} part


app.listen(process.env.PORT, () => {
  console.log('[+] Server restarted 😋');
})

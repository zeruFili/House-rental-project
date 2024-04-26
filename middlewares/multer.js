// controllers/uploadController.js

const multer = require("multer");
const path = require("path");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload

const upload = multer({
  storage: storage,
  limits: { fileSize: 7000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("myImages", 5);

// Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

function checkFileType(files, cb) {
  // Ensure files is an array
  if (!Array.isArray(files)) {
    files = [files];
  }

  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Iterate through each file
  for (let file of files) {
    // Check extension
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (!(extname && mimetype)) {
      return cb("Error: Images Only!");
    }
  }
  cb(null, true);
}

// const uploadFile = (req, res) => {
//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // Multer error
//       let errorMessage;
//       if (err.code === "LIMIT_FILE_SIZE") {
//         errorMessage = "Error: File size exceeds the limit.";
//       } else {
//         console.log(err);
//         errorMessage = `Error: ${err.message}`;
//       }
//       return res.status(400).json({ error: errorMessage });
//     } else if (err) {
//       // Other errors
//       return res.status(400).json({ error: `Error: ${err}` });
//     } else {
//       if (req.files == undefined) {
//         // Change `req.file` to `req.files`
//         console.log(err);
//         return res.status(400).json({ error: "Error: No File Selected!" });
//       } else {
//         const files = req.files.map((file) => `uploads/${file.filename}`);
//         console.log(files); // Log the files array to the console
//         return res.status(200).json({
//           message: "Files Uploaded!",
//           files: files,
//         });
//       }
//     }
//   });
// };
const uploadFileMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      let errorMessage;
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "Error: File size exceeds the limit.";
      } else {
        console.log(err);
        errorMessage = `Error: ${err.message}`;
      }
      return res.status(400).json({ error: errorMessage });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: `Error: ${err}` });
    } else {
      if (req.files == undefined) {
        console.log(err);
        return res.status(400).json({ error: "Error: No File Selected!" });
      } else {
        // Log the files array to the console
        // console.log(req.files);

        // Continue processing or pass the files to the next middleware/controller
        next();
      }
    }
  });
};

module.exports = {
  // handleFileUpload,
  uploadFileMiddleware,
  // uploadFile,
};

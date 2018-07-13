let express = require('express');
let multiparty = require('connect-multiparty');
let multipartymiddleware = multiparty();

let router = express.Router();


let UserRouter = require('../api/v1.0/users/route');

let ConstantsRouter = require('../api/v1.0/constants/route');

let SubscribersRouter = require('../api/v1.0/subscribers/route');


// router.use('/users',UserRouter);

// router.use('/constants',ConstantsRouter);

router.use('/subscribers',SubscribersRouter);

router.post('/users/uploader', multipartymiddleware, function(req, res) {
    var fs = require('fs');

    fs.readFile(req.files.upload.path, function (err, data) {
        var timeStamp=new Date()-0;
        var newPath = 'client/images/editorImages/' +timeStamp+""+ req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                res.send(err)
            }
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/images/editorImages/" +timeStamp+""+ req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";
                res.send(html);
            }
        });
    });
});


module.exports = router;
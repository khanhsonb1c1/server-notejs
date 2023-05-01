const checkUploadMiddleware = {
    checkUploadSinger: (req, res, next) => {
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(403).json("No files were uploaded.");
        } else {
            next()
        }
      },


      checkUploadFields: (req, res, next) => {
        
      }
}

module.exports = checkUploadMiddleware;
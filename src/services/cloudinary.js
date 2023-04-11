const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dionk3ia2",
  api_key: "644653757634464",
  api_secret: "9a6REbcMkfxUYpEp5Gv1BO_KURM",
});

module.exports = cloudinary;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloud = (file) => {
    return new Promise((resolve, reject) => {
        if (!cloudinary.uploader || !cloudinary.uploader.upload_stream) {
            return reject(new Error("Cloudinary uploader is undefined"));
        }

        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "resumes" },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );

        stream.end(file.data); 
    });
};

module.exports = uploadToCloud;

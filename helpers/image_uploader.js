exports.uploadTo = (cloudinary, file, config) => {
  return new Promise((resolve, reject) => {
    const file_extracted = file;
    const upload_stream = cloudinary.uploader.upload_stream(
      config,
      (err, result) => {
        if (!err) {
          resolve(result.secure_url);
        } else {
          reject(`Could not upload ${err}`);
        }
      }
    );

    file_extracted
      .createReadStream(file_extracted.filename)
      .pipe(upload_stream);
  });
};

exports.destroyTo = (cloudinary, public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
      if (!err) {
        resolve(true);
      } else {
        reject(err);
      }
    });
  });
};

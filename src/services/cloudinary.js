import { uploadTo, destroyTo } from "../../helpers/image_uploader";

class CloudinaryService {
  constructor() {
    this.cloudinary = require("cloudinary").v2;

    this.cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  async uploadUserImage(file, email) {
    if (typeof file === "string") return file;

    const url = await uploadTo(this.cloudinary, await file, {
      unique_filename: false,
      public_id: `${process.env.NODE_ENV}/users/${email}/thumbnail`,
    });

    if (!url) throw new Error("Image could not be upload");
    return url;
  }

  async deleteUserImage(email) {
    return await destroyTo(this.cloudinary, `users/${email}/thumbnail`);
  }

  async getImage(id, options) {
    return this.cloudinary.url(id, options);
  }

  async updateAdImages(files, email, index, oldLength) {
    await this.deleteAdImages(email, index, oldLength);
    return await this.uploadAdImages(files, email, index);
  }

  async uploadAdImages(files, email, index) {
    var list = [];

    for (let i = 0; i < files.length; ++i) {
      if (typeof files[i] === "string") {
        list.push(files[i]);
        continue;
      }

      const url = await uploadTo(this.cloudinary, await files[i], {
        public_id: `${process.env.NODE_ENV}/users/${email}/ads/${index}/${i}`,
      });

      list.push(url);
    }

    if (list.length === 0) throw new Error("Images did not upload");
    return list;
  }

  async deleteAdImages(email, index, length) {
    var b = true;

    for (let i = 0; i < length; ++i) {
      const destroyed = await destroyTo(
        this.cloudinary,
        `users/${email}/ads/${index}/${i}`
      );

      if (!destroyed) b = false;
    }

    return b;
  }
}

export default new CloudinaryService();

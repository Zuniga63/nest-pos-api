import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { createSlug } from 'src/utils';
import { IImage } from 'src/types';
import { nanoid } from 'nanoid';
import createProfilePhotosPreset from './presets/create-user-profile-preset';
import createProductBrandPreset from './presets/create-product-brand-preset';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    fileName?: string,
    preset = 'ml_default',
  ): Promise<UploadApiResponse | undefined> {
    const { mimetype } = file;
    const [fileType] = mimetype.split('/') as ['image' | 'video' | 'raw' | 'auto' | undefined];
    const options: UploadApiOptions = {
      upload_preset: preset,
      resource_type: fileType,
    };

    if (fileName) {
      const name = encodeURIComponent(createSlug(fileName));
      const id = nanoid(10);

      options.public_id = `${name}-${id}`;
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  getImageInfo(uploadResponse?: UploadApiResponse): IImage | undefined {
    let image: IImage | undefined;

    if (uploadResponse) {
      const { public_id: publicId, width, height, format, resource_type: type, secure_url: url } = uploadResponse;
      image = { publicId, width, height, format, type, url };
    }

    return image;
  }

  createPresets() {
    const result = Promise.all([createProfilePhotosPreset(), createProductBrandPreset()]);
    return result;
  }

  /**
   * Update the file name of cloudinary
   * @param lastId
   * @param fileName
   * @param isPublicId for define if the file name is a public id
   * @returns
   */
  async renameFile(lastId: string, fileName: string, isPublicId = false) {
    try {
      let newPublicId = fileName;

      if (!isPublicId) {
        // Get the current folder of file
        const lastIdParts = lastId.split('/'); // Get parts of id
        lastIdParts.pop(); // Remove the file name
        const folderUrl = lastIdParts.join('/');

        // Create the new pucblic Id
        const newFileName = encodeURIComponent(createSlug(fileName)) + '-' + nanoid(10);
        newPublicId = folderUrl ? `${folderUrl}/${newFileName}` : newFileName;
      }

      const res = await v2.uploader.rename(lastId, newPublicId, { invalidate: true, overwrite: true });
      return this.getImageInfo(res);
    } catch (error) {
      return undefined;
    }
  }

  async destroyFile(publicId: string) {
    let isDelted = false;
    try {
      const cloudRes = await v2.uploader.destroy(publicId);
      console.log('Cloudinary destroy success:', cloudRes);
      isDelted = true;
    } catch (error) {
      console.log('Cloudinary destroy error: ', error);
    }

    return isDelted;
  }
}

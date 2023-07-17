import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryPreset } from '../preset.enum';

export default async function createProductCategoryPreset(folder = 'categories') {
  const presetName = CloudinaryPreset.PRODUCT_CATEGORY;
  let message = '';

  try {
    const preset = await cloudinary.api.create_upload_preset({
      name: presetName,
      folder,
      resource_type: 'image',
      allowed_formats: 'jpg, png, gif, webp, bmp, jpe, jpeg',
      access_mode: 'public',
      unique_filename: true,
      auto_tagging: 0.7,
      overwrite: true,

      transformation: [
        {
          width: 200,
          height: 200,
          crop: 'thumb',
        },
      ],
    });

    message = preset.message;
  } catch (error: any) {
    if (error.error && typeof error.error.message === 'string') {
      message = error.error.message;
    }
  }

  return {
    name: presetName,
    message,
  };
}

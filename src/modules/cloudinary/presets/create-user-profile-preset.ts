import { v2 as cloudinary } from 'cloudinary';

export default async function createProfilePhotosPreset(
  folder = 'profile_photos'
) {
  const presetName = 'user_profile_preset2';
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
          gravity: 'face',
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

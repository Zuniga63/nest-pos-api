import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductBrand, ProductBrandDocument } from './schemas/product-brand.schema';
import { Model } from 'mongoose';
import { ProductBrandDto } from './dto/product-brand.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryPreset } from '../cloudinary/preset.enum';
import { IImage } from 'src/types';

@Injectable()
export class ProductBrandService {
  constructor(
    @InjectModel(ProductBrand.name) private productBrandModel: Model<ProductBrandDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductBrandDto: CreateProductBrandDto): Promise<ProductBrandDto> {
    const { name, image } = createProductBrandDto;
    const productBrand = await this.productBrandModel.create({ name });

    if (image) {
      try {
        // Save the file in the cloudinary
        const cloundResponse = await this.cloudinaryService.uploadImage(image, name, CloudinaryPreset.PRODUCT_BRAND);

        const imageData = this.cloudinaryService.getImageInfo(cloundResponse);
        productBrand.image = imageData;
        await productBrand.save({ validateModifiedOnly: true });
      } catch (error) {
        console.log('Image not save.');
      }
    }

    return productBrand;
  }

  findAll() {
    return this.productBrandModel.find({}).sort('name');
  }

  async findOne(id: string) {
    const brand = await this.productBrandModel.findById(id);
    if (!brand) throw new NotFoundException('Marca no encontrada');

    return brand;
  }

  async update(id: string, updateProductBrandDto: UpdateProductBrandDto) {
    const { name, image } = updateProductBrandDto;
    const brand = await this.productBrandModel.findById(id);
    if (!brand) throw new NotFoundException('¡Marca que se intenta actualizar no existe!');

    const lastImage = brand.image;
    let newImage: IImage | undefined;

    if (image) {
      try {
        const cloundResponse = await this.cloudinaryService.uploadImage(
          image,
          name || brand.name,
          CloudinaryPreset.PRODUCT_BRAND,
        );
        newImage = this.cloudinaryService.getImageInfo(cloundResponse);
      } catch (error) {
        throw new UnprocessableEntityException('¡La imagen no pudo ser procesada!');
      }
    }

    if (name && name !== brand.name) brand.name = name;
    if (newImage) brand.image = newImage;

    try {
      // Update the image name of cloudinary
      if (brand.directModifiedPaths().includes('name') && lastImage && !newImage) {
        const imageRenamed = await this.cloudinaryService.renameFile(lastImage.publicId, brand.name);
        if (imageRenamed) brand.image = imageRenamed;
      }

      // Update the entity
      await brand.save({ validateModifiedOnly: true });

      // Finaly remove the last image
      if (lastImage && newImage) this.cloudinaryService.destroyFile(lastImage.publicId);
      return brand;
    } catch (error) {
      if (newImage) {
        this.cloudinaryService.destroyFile(newImage.publicId);
      } else if (brand.directModifiedPaths().includes('image') && lastImage && brand.image) {
        this.cloudinaryService.renameFile(brand.image.publicId, lastImage.publicId, true);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const brand = await this.productBrandModel.findByIdAndDelete(id);
    if (!brand) throw new NotFoundException('La marca a eliminar no existe');

    if (brand.image) this.cloudinaryService.destroyFile(brand.image.publicId);
    return brand;
  }
}

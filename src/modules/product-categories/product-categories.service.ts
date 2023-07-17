import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCategory, ProductCategoryDocument } from './schemas/product-category.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { createSlug } from 'src/utils';
import { nanoid } from 'nanoid';
import { CloudinaryPreset } from '../cloudinary/preset.enum';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const { mainCategory: categoryId, image, name, ...rest } = createProductCategoryDto;
    const slug = `${createSlug(name)}-${nanoid(4)}`;
    const newCategory = new this.productCategoryModel({ name, slug, ...rest });

    let mainCategory: ProductCategoryDocument | null = null;

    if (categoryId) {
      mainCategory = await this.productCategoryModel.findById(categoryId);
      if (mainCategory) {
        newCategory.mainCategory = mainCategory.id;
        mainCategory.subcategories.push(newCategory.id);
      }
    }

    if (image) {
      const cloundResponse = await this.cloudinaryService.uploadImage(image, name, CloudinaryPreset.PRODUCT_CATEGORY);
      newCategory.image = this.cloudinaryService.getImageInfo(cloundResponse);
    }

    try {
      await Promise.all([newCategory.save(), mainCategory?.save({ validateModifiedOnly: true })]);
      newCategory.mainCategory = mainCategory || undefined;
      return newCategory;
    } catch (error) {
      const { image } = newCategory;
      if (image) this.cloudinaryService.destroyFile(image.publicId);
      throw error;
    }
  }

  findAll() {
    return this.productCategoryModel
      .find()
      .where('mainCategory')
      .equals(null)
      .populate('subcategories')
      .sort('order')
      .sort('name');
  }

  async findOne(id: string) {
    const category = await this.productCategoryModel.findById(id).populate('mainCategory').populate('subcategories');
    if (!category) throw new NotFoundException('La categoría a actualizar no existe.');

    return category;
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const { mainCategory: mainCategoryId, image, name, isEnabled, isPublished, order } = updateProductCategoryDto;

    // Get category
    const category = await this.productCategoryModel.findById(id);
    if (!category) throw new NotFoundException('La categoría a actualizar no existe.');

    const [currentMainCategory, newMainCategory] = await Promise.all([
      category.mainCategory
        ? this.productCategoryModel.findById(category.mainCategory).populate('subcategories')
        : null,
      mainCategoryId ? this.productCategoryModel.findById(mainCategoryId).populate('subcategories') : null,
    ]);

    // Create instance for save images
    const currentImage = category.image;
    let newImage: typeof category.image;

    if (name && name !== category.name) {
      // Update category
      category.name = name;
      category.slug = createSlug(name) + '-' + nanoid(4);

      // Update image public id
      if (!image && currentImage) {
        // ? This method dont throw error if not succeefully, can continue if fail
        const res = await this.cloudinaryService.renameFile(currentImage.publicId, name);
        if (res) category.image = res;
      }
    }

    //* Store the new Image of category
    if (image) {
      try {
        const cloundResponse = await this.cloudinaryService.uploadImage(
          image,
          category.name,
          CloudinaryPreset.PRODUCT_CATEGORY,
        );
        newImage = this.cloudinaryService.getImageInfo(cloundResponse);
        category.image = newImage;
      } catch (error) {
        //? In this point dont save nothing, throw error for notify user.
        throw new UnprocessableEntityException('¡La imagen no pudo ser procesada!');
      }
    }

    if (currentMainCategory && newMainCategory && !currentMainCategory._id.equals(newMainCategory._id)) {
      category.mainCategory = newMainCategory;
      newMainCategory.subcategories.push(category.id);

      const { subcategories } = currentMainCategory;
      currentMainCategory.subcategories = subcategories.filter((c) => c.id !== category.id);
    } else if (newMainCategory && !currentMainCategory) {
      category.mainCategory = newMainCategory;
      newMainCategory.subcategories.push(category.id);
    } else if (!newMainCategory && currentMainCategory) {
      category.mainCategory = undefined;

      const { subcategories } = currentMainCategory;
      currentMainCategory.subcategories = subcategories.filter((c) => !c.id === category.id);
    }

    category.isEnabled = Boolean(isEnabled);
    category.isPublished = Boolean(isPublished);
    if (order && order !== category.order) category.order = order;

    try {
      await Promise.all([
        category.save({ validateModifiedOnly: true }),
        currentMainCategory?.save({ validateModifiedOnly: true }),
        newMainCategory?.save({ validateModifiedOnly: true }),
      ]);

      if (newImage && currentImage) this.cloudinaryService.destroyFile(currentImage.publicId);

      return category;
    } catch (error) {
      // Restore image name
      if (category.modifiedPaths().includes('name') && currentImage && category.image) {
        this.cloudinaryService.renameFile(category.image.publicId, currentImage.publicId, true);
      }

      // Delete the new image
      if (newImage) this.cloudinaryService.destroyFile(newImage.publicId);

      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.productCategoryModel.findById(id).populate('subcategories', 'name');
    if (!category) throw new NotFoundException('La categoría a eliminar no existe.');
    if (category.subcategories.length > 0) throw new BadRequestException(category.subcategories.length.toString());

    await category.deleteOne();

    if (category.mainCategory) {
      const mainCategory = await this.productCategoryModel
        .findById(category.mainCategory)
        .populate('subcategories', 'name');
      if (mainCategory) {
        const { subcategories } = mainCategory;
        mainCategory.subcategories = subcategories.filter((c) => c.id !== category.id);
        await mainCategory.save({ validateModifiedOnly: true });
      }
    }

    if (category.image) this.cloudinaryService.destroyFile(category.image.publicId);

    return category;
  }
}

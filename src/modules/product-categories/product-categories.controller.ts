import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductCategoryDto } from './dto/product-category.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';
import { ProductCategoryBaseDto } from './dto/product-category-base.dto';

@Controller('product-categories')
@ApiTags('Product Categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  // --------------------------------------------------------------------------
  // CREATE A NEW CATEGORY
  // --------------------------------------------------------------------------
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create new Product Category',
    description: 'This end point create a new category and seve the image',
  })
  @ApiOkResponse({
    description: 'The category was created correctly',
    type: ProductCategoryDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createProductCategoryDto: CreateProductCategoryDto, @UploadedFile() image: Express.Multer.File) {
    createProductCategoryDto.image = image;
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  // --------------------------------------------------------------------------
  // GET MAIN CATEGORIES
  // --------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all product categories',
    description: 'This end point return the all product categories sort by name',
  })
  @ApiOkResponse({
    description: 'List of brands',
    type: [ProductCategoryDto],
  })
  findAll() {
    return this.productCategoriesService.findAll();
  }

  // --------------------------------------------------------------------------
  // GET PRODUCT CATEGORY
  // --------------------------------------------------------------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Get product category by ID',
    description: 'This end point return the all category data',
  })
  @ApiOkResponse({
    description: 'Brand data',
    type: ProductCategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Product category not found',
  })
  findOne(@Param() { id }: FindOneParams) {
    return this.productCategoriesService.findOne(id);
  }

  // --------------------------------------------------------------------------
  // UPDATE PRODUCT CATEGORY
  // --------------------------------------------------------------------------
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update Product Category',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Brand entity was updated',
    type: ProductCategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Product category not found',
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  update(
    @Param() { id }: FindOneParams,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    updateProductCategoryDto.image = image;
    return this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product category',
  })
  @ApiOkResponse({
    description: 'Deleted prodcut category data',
    type: ProductCategoryBaseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product category not Found',
  })
  @ApiBadRequestResponse({
    description: 'The product category dont remove',
    type: ValidationErrorDto,
  })
  remove(@Param() { id }: FindOneParams) {
    return this.productCategoriesService.remove(id);
  }
}

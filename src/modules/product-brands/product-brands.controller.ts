import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductBrandService } from './product-brands.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
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
import { ProductBrandDto } from './dto/product-brand.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';

@Controller('product-brands')
@ApiTags('Brands')
export class ProductBrandController {
  constructor(private readonly productBrandService: ProductBrandService) {}

  // --------------------------------------------------------------------------
  // CREATE A NEW BRAND
  // --------------------------------------------------------------------------
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create new Brand',
    description: 'This end point create a new brand and seve the image',
  })
  @ApiOkResponse({
    description: 'The brand name was created correctly',
    type: ProductBrandDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createProductBrandDto: CreateProductBrandDto, @UploadedFile() image: Express.Multer.File) {
    createProductBrandDto.image = image;
    return this.productBrandService.create(createProductBrandDto);
  }

  // --------------------------------------------------------------------------
  // GET ALL BRAND SOR BY NAME
  // --------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all brands',
    description: 'This end point return the all brands sort by name',
  })
  @ApiOkResponse({
    description: 'List of brands',
    type: [ProductBrandDto],
  })
  findAll() {
    return this.productBrandService.findAll();
  }

  // --------------------------------------------------------------------------
  // GET ONE BRAND
  // --------------------------------------------------------------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Get brand by ID',
    description: 'This end point return the all brand data',
  })
  @ApiOkResponse({
    description: 'Brand data',
    type: ProductBrandDto,
  })
  @ApiNotFoundResponse({
    description: 'Brand not Found',
  })
  findOne(@Param() { id }: FindOneParams) {
    return this.productBrandService.findOne(id);
  }

  // --------------------------------------------------------------------------
  // UPDATE BRAND
  // --------------------------------------------------------------------------
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Update Brand',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Brand entity was updated',
    type: ProductBrandDto,
  })
  @ApiNotFoundResponse({
    description: 'Brand not Found',
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
    @Body() updateProductBrandDto: UpdateProductBrandDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    updateProductBrandDto.image = image;
    return this.productBrandService.update(id, updateProductBrandDto);
  }

  // --------------------------------------------------------------------------
  // DELETE PRODUCT BRAND
  // --------------------------------------------------------------------------
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product brand',
  })
  @ApiOkResponse({
    description: 'Deleted Brand data',
    type: ProductBrandDto,
  })
  @ApiNotFoundResponse({
    description: 'Brand not Found',
  })
  remove(@Param() { id }: FindOneParams) {
    return this.productBrandService.remove(id);
  }
}

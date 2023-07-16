import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSizesService } from './product-sizes.service';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ProductSizeDto } from './dto/product-size.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';

@Controller('product-sizes')
@ApiTags('Product Size')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------
  @Post()
  @ApiOperation({
    summary: 'Create new product size',
  })
  @ApiOkResponse({
    description: 'The product size was created correctly',
    type: ProductSizeDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createProductSizeDto: CreateProductSizeDto) {
    return this.productSizesService.create(createProductSizeDto);
  }

  // --------------------------------------------------------------------------
  // GET ALL SIZES
  // --------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all product sizes',
    description: 'This end point return the all product size sort by type and order property',
  })
  @ApiOkResponse({
    description: 'List of product sizes',
    type: [ProductSizeDto],
  })
  findAll() {
    return this.productSizesService.findAll();
  }

  // --------------------------------------------------------------------------
  // GET ONE COLOR
  // --------------------------------------------------------------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Get product size by ID',
  })
  @ApiOkResponse({
    description: 'Product size data',
    type: ProductSizeDto,
  })
  @ApiNotFoundResponse({
    description: 'Product size not Found',
  })
  findOne(@Param() { id }: FindOneParams) {
    return this.productSizesService.findOne(id);
  }

  // --------------------------------------------------------------------------
  // UPDATE COLOR
  // --------------------------------------------------------------------------
  @Patch(':id')
  @ApiOperation({
    summary: 'Update product size by ID',
  })
  @ApiOkResponse({
    description: 'The product size was updated correctly',
    type: ProductSizeDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Product size not Found',
  })
  update(@Param() { id }: FindOneParams, @Body() updateProductSizeDto: UpdateProductSizeDto) {
    return this.productSizesService.update(id, updateProductSizeDto);
  }

  // --------------------------------------------------------------------------
  // DELETE TAG
  // --------------------------------------------------------------------------
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product size by ID',
  })
  @ApiOkResponse({
    description: 'Deleted product size data',
    type: ProductSizeDto,
  })
  @ApiNotFoundResponse({
    description: 'Color not Found',
  })
  remove(@Param() { id }: FindOneParams) {
    return this.productSizesService.remove(id);
  }
}

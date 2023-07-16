import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductColorsService } from './product-colors.service';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductColorDto } from './dto/product-color.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';

@Controller('product-colors')
@ApiTags('Product Colors')
export class ProductColorsController {
  constructor(private readonly productColorsService: ProductColorsService) {}

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------
  @Post()
  @ApiOperation({
    summary: 'Create new Color',
  })
  @ApiOkResponse({
    description: 'The color was created correctly',
    type: ProductColorDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createProductColorDto: CreateProductColorDto) {
    return this.productColorsService.create(createProductColorDto);
  }

  // --------------------------------------------------------------------------
  // GET ALL COLORS
  // --------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all colors',
    description: 'This end point return the all colors sort by name',
  })
  @ApiOkResponse({
    description: 'List of tags',
    type: [ProductColorDto],
  })
  findAll() {
    return this.productColorsService.findAll();
  }

  // --------------------------------------------------------------------------
  // GET ONE COLOR
  // --------------------------------------------------------------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Get color by ID',
    description: 'This end point return the all color data',
  })
  @ApiOkResponse({
    description: 'Color data',
    type: ProductColorDto,
  })
  @ApiNotFoundResponse({
    description: 'Color not Found',
  })
  findOne(@Param() { id }: FindOneParams) {
    return this.productColorsService.findOne(id);
  }

  // --------------------------------------------------------------------------
  // UPDATE COLOR
  // --------------------------------------------------------------------------
  @Patch(':id')
  @ApiOperation({
    summary: 'Update color by ID',
  })
  @ApiOkResponse({
    description: 'The color was updated correctly',
    type: ProductColorDto,
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
    description: 'Color not Found',
  })
  update(@Param() { id }: FindOneParams, @Body() updateProductColorDto: UpdateProductColorDto) {
    return this.productColorsService.update(id, updateProductColorDto);
  }

  // --------------------------------------------------------------------------
  // DELETE TAG
  // --------------------------------------------------------------------------
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product color by ID',
  })
  @ApiOkResponse({
    description: 'Deleted color data',
    type: ProductColorDto,
  })
  @ApiNotFoundResponse({
    description: 'Color not Found',
  })
  remove(@Param() { id }: FindOneParams) {
    return this.productColorsService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductTagsService } from './product-tags.service';
import { CreateProductTagDto } from './dto/create-product-tag.dto';
import { UpdateProductTagDto } from './dto/update-product-tag.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductTagDto } from './dto/product-tag.dto';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { FindOneParams } from './dto/find-one-params.dto';

@Controller('product-tags')
@ApiTags('Tags')
export class ProductTagsController {
  constructor(private readonly productTagsService: ProductTagsService) {}

  // --------------------------------------------------------------------------
  // CREATE A NEW TAG
  // --------------------------------------------------------------------------
  @Post()
  @ApiOperation({
    summary: 'Create new Tag',
  })
  @ApiOkResponse({
    description: 'The tag was created correctly',
    type: ProductTagDto,
  })
  @ApiBadRequestResponse({
    description: 'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createProductTagDto: CreateProductTagDto) {
    return this.productTagsService.create(createProductTagDto);
  }

  // --------------------------------------------------------------------------
  // GET ALL TAGS
  // --------------------------------------------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all tags',
    description: 'This end point return the all tags sort by name',
  })
  @ApiOkResponse({
    description: 'List of tags',
    type: [ProductTagDto],
  })
  findAll() {
    return this.productTagsService.findAll();
  }

  // --------------------------------------------------------------------------
  // GET ONE TAG
  // --------------------------------------------------------------------------
  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by ID',
    description: 'This end point return the all tag data',
  })
  @ApiOkResponse({
    description: 'Tag data',
    type: ProductTagDto,
  })
  @ApiNotFoundResponse({
    description: 'Tag not Found',
  })
  findOne(@Param() { id }: FindOneParams) {
    return this.productTagsService.findOne(id);
  }

  // --------------------------------------------------------------------------
  // UPDATE TAG
  // --------------------------------------------------------------------------
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Tag by ID',
  })
  @ApiOkResponse({
    description: 'The tag was updated correctly',
    type: ProductTagDto,
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
    description: 'Tag not Found',
  })
  update(@Param() { id }: FindOneParams, @Body() updateProductTagDto: UpdateProductTagDto) {
    return this.productTagsService.update(id, updateProductTagDto);
  }

  // --------------------------------------------------------------------------
  // DELETE TAG
  // --------------------------------------------------------------------------
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product tag by ID',
  })
  @ApiOkResponse({
    description: 'Deleted tag data',
    type: ProductTagDto,
  })
  @ApiNotFoundResponse({
    description: 'Tag not Found',
  })
  remove(@Param() { id }: FindOneParams) {
    return this.productTagsService.remove(id);
  }
}

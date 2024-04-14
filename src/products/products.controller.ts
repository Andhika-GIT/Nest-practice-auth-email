import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-products';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Get()
    findAll() : Promise<Product[]>{
        return this.productService.findAll()
    }

    @Get(":id")
    findById(@Param('id', ParseIntPipe) id: Number) : Promise<Product>{
        return this.productService.findById(id)
    }

    @Post()
    create(@Body(ValidationPipe) newProduct: CreateProductDto): Promise<Product> {
        return this.productService.create(newProduct)
    }

    @Patch(":id")
    update(@Param('id', ParseIntPipe) id: Number,@Body(ValidationPipe) updatedProduct: UpdateProductDto): Promise<Product>{
        return this.productService.update(id, updatedProduct)
    }

    @Delete("/deleteMultiple/:id")
    deleteMany(@Param('id') id: string): Promise<string> {
       const arrayNumbers = id.split(",").map(ids => parseInt(ids))

       return this.productService.deleteMultiple(arrayNumbers)
    }

    @Delete(":id")
    delete(@Param('id', ParseIntPipe) id: Number) : Promise<string>{
        return this.productService.delete(id)
    }

  
}

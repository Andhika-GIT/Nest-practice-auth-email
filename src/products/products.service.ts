import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-products';

@Injectable()
export class ProductsService {
   constructor(
    @InjectModel(Product)
    private productRepository: typeof Product
   ) {}

   async findAll(): Promise<Product[]>{
    return this.productRepository.findAll()
   }

   async findById(id: Number) : Promise<Product>{
      const selectedProduct = await this.productRepository.findOne({
         where: {
            id: id
         }
      })

      if (!selectedProduct) {
         throw new NotFoundException("product not found")
      }

      return selectedProduct
   }

   async create(product: CreateProductDto): Promise<Product>{
      return this.productRepository.create(product as any)
   }

   async update(id: Number, updatedProduct: UpdateProductDto): Promise<Product>{
      const selectedProduct = await this.productRepository.findOne({
         where: {
            id: id
         }
      })

      if (!selectedProduct) {
         throw new NotFoundException("product not found")
      }

      (await selectedProduct.update(updatedProduct)).save()

      return selectedProduct
   }

   async delete(id: Number): Promise<string>{
      const selectedProduct = await this.productRepository.findOne({
         where: {
            id: id
         }
      })

      if (!selectedProduct) {
         throw new NotFoundException("product not found")
      }

      await selectedProduct.destroy()

      return "Sucessfully deleted product"
   }

   async deleteMultiple(ids: Number[]): Promise<string>{
      try{
         await this.productRepository.destroy({
            where: {
               id: ids
            }
         })
      }
      catch(err){
         return "something went wrong"
      }

      return "Sucessfully deleted products"
   }

  
}

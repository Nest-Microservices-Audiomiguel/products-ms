import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log(`Connected to the database`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });
  }

  async findAll({ limit, page }: PaginationDto) {
    const totalPages = await this.product.count({
      where: {
        status: true,
      },
    });
    const lastPage = Math.ceil(totalPages / limit);
    const data = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        status: true,
      },
    });

    return {
      data,
      meta: {
        page,
        totalPages,
        lastPage,
      },
    };
  }

  findOne(id: number) {
    return this.product.findFirstOrThrow({
      where: {
        id,
        status: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    return this.product.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: number) {
    return this.product.update({
      where: { id },
      data: {
        status: false,
      },
    });
  }
}

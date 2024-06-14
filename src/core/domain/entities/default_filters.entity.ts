import { AutoValidator } from '@/libs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export enum OrderMode {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Order {
  property?: string;
  mode?: OrderMode;
}

export interface Pagination {
  take?: number;
  skip?: number;
}
export interface DefaultFilters {
  createdAtStart?: Date;
  createdAtEnd?: Date;
  updatedAtStart?: Date;
  updatedAtEnd?: Date;
}

export interface TPaginationResponse<T> {
  data: T[];
  totalItemsListed: number;
  totalItems: number;
}

export class PaginationEntity implements Pagination {
  take: number;
  skip: number;

  constructor(props: Pagination) {
    this.take = props.take ?? 10;
    this.skip = props.skip ?? 0;
  }
}

export class OrderEntity implements Order {
  property: string;
  mode: OrderMode;

  constructor(props: Partial<Order>) {
    this.property = props.property ?? 'createdAt';
    this.mode = props.mode ?? OrderMode.ASC;
  }
}

export class DefaultFiltersEntity implements DefaultFilters {
  take: number;
  skip: number;
  createdAtStart?: Date;
  createdAtEnd?: Date;
  updatedAtStart?: Date;
  updatedAtEnd?: Date;

  constructor(props: DefaultFilters) {
    this.createdAtStart = props.createdAtStart;
    this.createdAtEnd = props.createdAtEnd;
    this.updatedAtStart = props.updatedAtStart;
    this.updatedAtEnd = props.updatedAtEnd;
  }
}

export class DefaultFiltersRequest
  extends AutoValidator
  implements DefaultFilters, Order, Pagination
{
  @IsOptional()
  @IsDate()
  createdAtStart?: Date;

  @IsOptional()
  @IsDate()
  createdAtEnd?: Date;

  @IsOptional()
  @IsDate()
  updatedAtStart?: Date;

  @IsOptional()
  @IsDate()
  updatedAtEnd?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  property: string;

  @IsOptional()
  @IsEnum(OrderMode)
  mode: OrderMode;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number;

  constructor(props: DefaultFilters) {
    super(props);
    Object.assign(this, props);
  }
}

export class GetPaginatedOrderByFilterDefaultRestRequest {
  @ApiPropertyOptional({
    description: 'CreatedAt date start range.',
  })
  @IsOptional()
  @IsDate()
  created_at_start?: Date;

  @ApiPropertyOptional({
    description: 'CreatedAt date end range.',
  })
  @IsOptional()
  @IsDate()
  created_at_end?: Date;

  @ApiPropertyOptional({
    description: 'UpdatedAt date start range.',
  })
  @IsOptional()
  @IsDate()
  updated_at_start?: Date;

  @ApiPropertyOptional({
    description: 'UpdatedAt date end range.',
  })
  @IsOptional()
  @IsDate()
  updated_at_end?: Date;

  @ApiPropertyOptional({
    description: 'Page sort property.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  property?: string;

  @ApiPropertyOptional({
    description: 'Page sort mode.',
  })
  @IsOptional()
  @IsEnum(OrderMode)
  mode?: OrderMode;

  @ApiPropertyOptional({
    description: 'Page size.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => value && parseInt(value))
  take?: number;

  @ApiPropertyOptional({
    description: 'Page number.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => value && parseInt(value))
  skip?: number;
}

export class PaginationResponse<T>
  extends AutoValidator
  implements TPaginationResponse<T>
{
  @IsArray()
  data: T[];

  @IsInt()
  @Max(100)
  @Min(0)
  totalItemsListed: number;

  @IsInt()
  @Min(0)
  totalItems: number;

  constructor(props) {
    super(props);
    Object.assign(this, props);
  }
}

export class PaginationRestResponse {
  @ApiProperty({
    description: 'Total of items listed.',
    example: 10,
  })
  @IsInt()
  total_items_listed: number;

  @ApiProperty({
    description: 'Total of items.',
    example: 100,
  })
  @IsInt()
  total_items: number;

  constructor(props: TPaginationResponse<any>) {
    this.total_items = props.totalItems;
    this.total_items_listed = props.totalItemsListed;
  }
}

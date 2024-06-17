import { GetEmblemssByFilterNestService } from '@/emblems/infra/nest/services/emblems';
import {
  TGetEmblemssByFilterResponse,
  TGetEmblemssByFilterRequest,
} from '@/emblems/interface/controllers/emblems';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  PickType,
} from '@nestjs/swagger';
import { GetPaginatedOrderByFilterDefaultRestRequest } from '@/core/domain';

class GetEmblemssByFilterRestQuery extends PickType(
  GetPaginatedOrderByFilterDefaultRestRequest,
  ['skip', 'take'],
) {
  @ApiProperty({
    description: 'Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  refId: string;

  @ApiProperty({
    description: 'Emblems name.',
    example: 'Cidade',
  })
  name: string;

  @ApiProperty({
    description: 'Emblems name.',
    example: 'cda',
  })
  id: number;

  @ApiProperty({
    description: 'Emblems slug.',
    example: '1',
  })
  slug: string;
}

class GetEmblemsByFilterRestResponse {
  @ApiProperty({
    description: 'Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  refId: string;

  @ApiProperty({
    description: 'Emblems name.',
    example: 'Cidade',
  })
  name: string;

  @ApiProperty({
    description: 'Emblems name.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Emblems slug.',
    example: 'cda',
  })
  slug: string;

  @ApiProperty({
    description: 'Emblems image.',
    example: 'https://cidadealtarp.com/imagens/challenge/cidade-alta.png',
  })
  image: string;

  @ApiProperty({
    description: 'Emblems created at date.',
    example: '1970-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Emblems updated at date.',
    example: '1970-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Emblems deleted at date.',
    example: '1970-01-01T00:00:00.000Z',
  })
  deletedAt: Date;
  constructor(response: TGetEmblemssByFilterRequest) {
    Object.assign(this, response);
  }
}

class GetEmblemssByFilterRestResponse {
  @ApiProperty({
    description: 'Amount of items remaining in database with filter applied.',
    example: 58,
  })
  total_items: number;

  @ApiProperty({
    description: 'Amount of items returned in response with filter applied.',
    example: 58,
  })
  total_items_listed: number;

  @ApiProperty({
    description: 'Emblems instances',
    isArray: true,
    type: GetEmblemsByFilterRestResponse,
  })
  data: GetEmblemsByFilterRestResponse[];

  constructor(response: TGetEmblemssByFilterResponse) {
    this.data = response.data.map(
      (instance) => new GetEmblemsByFilterRestResponse(instance),
    );
    this.total_items = response.totalItems;
    this.total_items_listed = response.totalItemsListed;
  }
}

@ApiTags('Emblems')
@Controller('Emblems')
export class GetEmblemssByFilterRestController {
  constructor(
    private readonly getEmblemssByFilterService: GetEmblemssByFilterNestService,
  ) {}

  @ApiOperation({
    summary: 'Get multiple Emblemss.',
    description: 'Get multiple Emblemss using filters.',
  })
  @ApiOkResponse({
    description: 'The Emblemss were returned successfully.',
    type: GetEmblemssByFilterRestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'User authentication failed.',
  })
  @ApiBadRequestResponse({
    description:
      'If any required params are missing or has invalid format or type.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'If any required params are missing or has invalid format or type.',
  })
  @Get()
  async execute(
    @Query() query: GetEmblemssByFilterRestQuery,
  ): Promise<GetEmblemssByFilterRestResponse> {
    const request: TGetEmblemssByFilterRequest = {
      name: query.name,
      slug: query.slug,
      id: query.id,

      skip: query.skip,
      take: query.take,
    };

    const result = await this.getEmblemssByFilterService.execute(request);

    const response = new GetEmblemssByFilterRestResponse(result);

    return response;
  }
}

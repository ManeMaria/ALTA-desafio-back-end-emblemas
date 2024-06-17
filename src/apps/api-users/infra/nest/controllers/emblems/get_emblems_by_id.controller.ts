import { GetEmblemsByIdNestService } from '@/emblems/infra/nest/services/emblems';
import {
  TGetEmblemsByIdRequest,
  GetEmblemsByIdResponse,
} from '@/emblems/interface/controllers/emblems';
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class GetEmblemsByIdRestParams {
  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  id: string;
}

class GetEmblemsByIdRestResponse {
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
    example: 'cda1',
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

  constructor(response: GetEmblemsByIdResponse) {
    Object.assign(this, response);
  }
}

@ApiTags('Emblems')
@Controller('emblems/:id')
export class GetEmblemsByIdRestController {
  constructor(
    private readonly getEmblemsByIdService: GetEmblemsByIdNestService,
  ) {}

  @ApiOperation({
    summary: 'Get a emblems.',
    description: 'Get a emblems using id.',
  })
  @ApiOkResponse({
    description: 'The emblems was returned successfully.',
    type: null,
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
    @Param() params: GetEmblemsByIdRestParams,
  ): Promise<GetEmblemsByIdRestResponse> {
    const request: TGetEmblemsByIdRequest = {
      refId: params.id,
    };

    const result = await this.getEmblemsByIdService.execute(request);

    const response = result && new GetEmblemsByIdRestResponse(result);

    return response;
  }
}

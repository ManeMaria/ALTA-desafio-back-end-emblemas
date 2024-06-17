import { UpdateEmblemsNestService } from '@/emblems/infra/nest/services/emblems';
import {
  UpdateEmblemsResponse,
  TUpdateEmblemsRequest,
} from '@/emblems/interface/controllers/emblems';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsOptional, IsUUID, IsAlpha } from 'class-validator';

class UpdateEmblemsRestParams {
  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  id: string;
}

class UpdateEmblemsRestBody {
  @ApiPropertyOptional({
    description: 'The name of the emblems.',
  })
  @IsOptional()
  @IsAlpha()
  name?: string;

  @ApiProperty({
    description: 'Emblems slug.',
    example: 'cda',
  })
  slug: string;
}

class UpdateEmblemsRestResponse {
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

  constructor(response: UpdateEmblemsResponse) {
    Object.assign(this, response);
  }
}

@ApiTags('Emblems')
@Controller('emblems/:id')
export class UpdateEmblemsRestController {
  constructor(
    private readonly createEmblemsService: UpdateEmblemsNestService,
  ) {}

  @ApiOperation({
    summary: 'Update a emblems.',
    description: 'Update a emblems using score and id.',
  })
  @ApiOkResponse({
    description: 'The emblems was updated successfully.',
    type: UpdateEmblemsRestResponse,
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
  @Patch()
  async execute(
    @Body() body: UpdateEmblemsRestBody,
    @Param() params: UpdateEmblemsRestParams,
  ): Promise<UpdateEmblemsRestResponse> {
    const request: TUpdateEmblemsRequest = {
      refId: params.id,
      name: body.name,
      slug: body.slug,
    };

    const result = await this.createEmblemsService.execute(request);

    const response = new UpdateEmblemsRestResponse(result);

    return response;
  }
}

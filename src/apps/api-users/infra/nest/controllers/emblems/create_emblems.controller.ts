import { CreateEmblemsNestService } from '@/emblems/infra/nest/services/emblems';
import {
  CreateEmblemsResponse,
  TCreateEmblemsRequest,
} from '@/emblems/interface/controllers/emblems';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

class CreateEmblemsRestBody {
  @ApiProperty({
    description: 'Emblems name.',
    example: 'Cidade',
  })
  name: string;

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
}

class CreateEmblemsRestResponse {
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

  constructor(response: CreateEmblemsResponse) {
    Object.assign(this, response);
  }
}

@ApiTags('Emblems')
@Controller('emblems')
export class CreateEmblemsRestController {
  constructor(
    private readonly createEmblemsService: CreateEmblemsNestService,
  ) {}

  @ApiOperation({
    summary: 'Create a new emblems.',
    description: 'Create a new emblems using score and userId.',
  })
  @ApiOkResponse({
    description: 'The emblems was created successfully.',
    type: CreateEmblemsRestResponse,
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
  @Post()
  async execute(
    @Body() body: CreateEmblemsRestBody,
  ): Promise<CreateEmblemsRestResponse> {
    const request: TCreateEmblemsRequest = {
      name: body.name,
      slug: body.slug,
      image: body.image,
    };

    const result = await this.createEmblemsService.execute(request);

    const response = new CreateEmblemsRestResponse(result);

    return response;
  }
}

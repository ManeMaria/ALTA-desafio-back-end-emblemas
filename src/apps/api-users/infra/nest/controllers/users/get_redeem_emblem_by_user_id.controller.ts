import { GetRedeemEmblemByUserIdNestService } from '@/apps/users/infra';
import { Public } from '@/libs/nest';
import {
  TGetRedeemEmblemByUserIdRequest,
  TGetRedeemEmblemByUserIdResponseItem,
} from '@/users/interface';
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class GetRedeemEmblemByUserIdRestQuery {
  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  userId: string;
}

class GetRedeemEmblemByUserIdRestResponseItems {
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
  constructor(response: TGetRedeemEmblemByUserIdResponseItem) {
    Object.assign(this, response);
  }
}

class GetRedeemEmblemByUserIdRestResponse {
  @ApiProperty({
    description: 'Emblems instances',
    isArray: true,
    type: GetRedeemEmblemByUserIdRestResponseItems,
  })
  data: GetRedeemEmblemByUserIdRestResponseItems[];

  constructor(response: TGetRedeemEmblemByUserIdResponseItem[]) {
    this.data = response.map(
      (emblem) => new GetRedeemEmblemByUserIdRestResponseItems(emblem),
    );
  }
}

@ApiTags('Users')
@Controller('users/:userId/get-redeem-emblem')
@Public()
export class GetRedeemEmblemByUserIdRestController {
  constructor(
    private readonly getRedeemEmblemByUserIdService: GetRedeemEmblemByUserIdNestService,
  ) {}

  @ApiOkResponse({
    description: 'The Emblemss were returned successfully.',
    type: GetRedeemEmblemByUserIdRestResponse,
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
    @Param() params: GetRedeemEmblemByUserIdRestQuery,
  ): Promise<GetRedeemEmblemByUserIdRestResponse | null> {
    const request: TGetRedeemEmblemByUserIdRequest = {
      userId: params.userId,
    };

    const response = await this.getRedeemEmblemByUserIdService.execute(request);

    return new GetRedeemEmblemByUserIdRestResponse(response);
  }
}

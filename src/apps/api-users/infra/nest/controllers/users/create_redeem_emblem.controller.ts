import { CreateRedeemEmblemNestService } from '@/apps/users/infra/nest/services/create_redeem_emblem.service';
import { Public } from '@/libs/nest';
import { TCreateRedeemEmblemRequest } from '@/users/interface';
import { Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class CreateRedeemEmblemRestQuery {
  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  userId: string;

  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  emblemsId: string;
}

@ApiTags('Users')
@Controller('users/:userId/redeem-emblem/:emblemsId')
@Public()
export class CreateRedeemEmblemRestController {
  constructor(
    private readonly createRedeemEmblemService: CreateRedeemEmblemNestService,
  ) {}

  @ApiOperation({
    summary: 'Create a new user.',
    description: 'Create a new user using name, email and password.',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({
    description:
      'If any required params are missing or has invalid format or type.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'If any required params are missing or has invalid format or type.',
  })
  @Post()
  async execute(@Param() params: CreateRedeemEmblemRestQuery): Promise<void> {
    const request: TCreateRedeemEmblemRequest = {
      emblemsId: params.emblemsId,
      userId: params.userId,
    };

    await this.createRedeemEmblemService.execute(request);
  }
}

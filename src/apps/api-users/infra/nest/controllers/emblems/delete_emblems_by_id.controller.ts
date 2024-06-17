import { DeleteEmblemsByIdNestService } from '@/emblems/infra/nest/services/emblems';
import { TDeleteEmblemsByIdRequest } from '@/emblems/interface/controllers/emblems';
import { Controller, Delete, Param } from '@nestjs/common';
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

class DeleteEmblemsByIdRestParams {
  @ApiProperty({
    description: 'The Emblems id.',
    example: '882e725d-d9c5-45b6-b37d-c19834d8c090',
  })
  @IsUUID(4)
  id: string;
}

@ApiTags('Emblems')
@Controller('emblems/:id')
export class DeleteEmblemsByIdRestController {
  constructor(
    private readonly deleteEmblemsByIdService: DeleteEmblemsByIdNestService,
  ) {}

  @ApiOperation({
    summary: 'Delete a emblems.',
    description: 'Delete a emblems using id.',
  })
  @ApiOkResponse({
    description: 'The emblems was deleted successfully.',
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
  @Delete()
  async execute(@Param() params: DeleteEmblemsByIdRestParams): Promise<void> {
    const request: TDeleteEmblemsByIdRequest = {
      refId: params.id,
    };

    await this.deleteEmblemsByIdService.execute(request);
  }
}

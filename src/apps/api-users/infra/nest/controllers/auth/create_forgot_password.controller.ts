import { CreateUserForgotPasswordNestService } from '@/users/infra';
import {
  TCreateUserForgotPasswordRequest,
  TCreateUserForgotPasswordResponse,
} from '@/users/interface';
import { Public } from '@/libs/nest';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

class CreateForgotPasswordRestBody {
  @ApiProperty({
    description: 'The user email.',
    example: 'abc@email.com',
  })
  @IsEmail()
  email: string;
}

class CreateForgotPasswordRestResponse {
  @ApiProperty({
    description: 'The forgot password id.',
    example: '20879d85-303d-4ebc-ba11-4ca85f3beebd',
  })
  id: string;

  constructor(props: TCreateUserForgotPasswordResponse) {
    this.id = props.id;
  }
}

@ApiTags('Auth')
@Controller('auth/forgot-password')
@Public()
export class CreateForgotPasswordRestController {
  constructor(
    private readonly createUserForgotPasswordService: CreateUserForgotPasswordNestService,
  ) {}

  @ApiOperation({
    summary: 'User create forgot password.',
    description: 'Endpoint to create a new forgot password.',
  })
  @ApiBody({
    type: CreateForgotPasswordRestBody,
    required: true,
    description: 'CreateForgotPassword requires user email.',
  })
  @ApiOkResponse({
    description: 'The forgot password created.',
    type: CreateForgotPasswordRestResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token authentication failed.',
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
    @Body() body: CreateForgotPasswordRestBody,
  ): Promise<CreateForgotPasswordRestResponse> {
    const request: TCreateUserForgotPasswordRequest = { email: body.email };

    const userForgotPassword =
      await this.createUserForgotPasswordService.execute(request);

    return new CreateForgotPasswordRestResponse(userForgotPassword);
  }
}

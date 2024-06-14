import { CreateUserNestService } from '@/apps/users/infra';
import { BcryptService } from '@/libs/bcrypt';
import { IsPassword } from '@/libs/class-validator';
import { Public } from '@/libs/nest';
import { UserState } from '@/users/domain';
import { CreateUserResponse, TCreateUserRequest } from '@/users/interface';
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
import { IsEmail, IsString, Length } from 'class-validator';

class CreateUserRestBody {
  @ApiProperty({
    description: 'The name of new user.',
    example: 'Jorge',
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'The email of new user.',
    example: 'abc@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of new user.',
    example: '007NoTimeToDie%',
  })
  @IsPassword()
  password: string;
}

class CreateUserRestResponse {
  @ApiProperty({
    description: 'User id.',
    example: '12123',
  })
  id: string;

  @ApiProperty({
    description: 'User state.',
    enum: UserState,
    example: UserState.PENDING_CONFIRMATION,
  })
  state: UserState;

  @ApiProperty({
    description: 'User name.',
    example: 'Jorge',
  })
  name: string;

  @ApiProperty({
    description: 'User email.',
    example: 'abc@email.com',
  })
  email: string;

  constructor(response: CreateUserResponse) {
    this.id = response.id;
    this.state = response.state;
    this.name = response.name;
    this.email = response.email;
  }
}

@ApiTags('Users')
@Controller('users')
@Public()
export class CreateUserRestController {
  constructor(
    private readonly hashService: BcryptService,
    private readonly createUserService: CreateUserNestService,
  ) {}

  @ApiOperation({
    summary: 'Create a new user.',
    description: 'Create a new user using name, email and password.',
  })
  @ApiOkResponse({
    description: 'The wallet accounts returned successfully.',
    type: CreateUserRestResponse,
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
    @Body() body: CreateUserRestBody,
  ): Promise<CreateUserRestResponse> {
    const passwordHash = this.hashService.hashSync(body.password);

    const request: TCreateUserRequest = {
      name: body.name,
      email: body.email,
      password: passwordHash,
    };

    const result = await this.createUserService.execute(request);

    const response = new CreateUserRestResponse(result);

    return response;
  }
}

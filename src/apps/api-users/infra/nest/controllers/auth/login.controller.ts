import { Public } from '@/libs/nest';
import { Controller, Post, UseGuards } from '@nestjs/common';
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
import {
  AuthUserParam,
  LocalAuthGuard,
  JwtTokenService,
} from '@/api-users/infra';
import { AuthUser } from '@/api-users/domain';
import { IsEmail } from 'class-validator';
import { IsPassword } from '@/libs/class-validator';

class LoginRestBody {
  @ApiProperty({
    description: 'The user email.',
    example: 'abc@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password.',
    example: '007NoTimeToDie',
  })
  @IsPassword()
  password: string;
}

class LoginRestResponse {
  @ApiProperty({
    description: 'The JWT access token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0MzE3MjA3LTdhMmYtNDg5ZC1hNjZiLTExMzExODlhZTdiMSIsImVtYWlsIjoiaXNhcXVlQGxvb21pLmNvbS5iciIsImlhdCI6MTY3ODcyMzQ3OSwiZXhwIjoxNjc4NzI3MDc5fQ.t6f1VZMvgktRBIX_yOueXNn5elRD7-Dho5i17zeJHmA',
  })
  access_token: string;
}

@ApiTags('Auth')
@Controller('auth/login')
@UseGuards(LocalAuthGuard)
@Public()
export class LoginRestController {
  constructor(private readonly tokenService: JwtTokenService) {}

  @ApiOperation({
    summary: 'User login.',
    description: 'Endpoint to user login using email and password.',
  })
  @ApiBody({
    type: LoginRestBody,
    required: true,
    description: 'Login requires username and password.',
  })
  @ApiOkResponse({
    description: 'The user access token.',
    type: LoginRestResponse,
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
  async execute(@AuthUserParam() user: AuthUser): Promise<LoginRestResponse> {
    const accessToken = await this.tokenService.generate(user);

    return {
      access_token: accessToken,
    };
  }
}

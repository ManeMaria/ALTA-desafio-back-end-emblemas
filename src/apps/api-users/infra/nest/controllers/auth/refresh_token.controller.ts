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
  JwtTokenService,
  RefreshTokenGuard,
} from '@/api-users/infra';
import { AuthUser } from '@/api-users/domain';
import { IsJWT } from 'class-validator';

class RefreshTokenRestBody {
  @ApiProperty({
    description: 'The JWT access token expired.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0MzE3MjA3LTdhMmYtNDg5ZC1hNjZiLTExMzExODlhZTdiMSIsImVtYWlsIjoiaXNhcXVlQGxvb21pLmNvbS5iciIsImlhdCI6MTY3ODcyMzQ3OSwiZXhwIjoxNjc4NzI3MDc5fQ.t6f1VZMvgktRBIX_yOueXNn5elRD7-Dho5i17zeJHmA',
  })
  @IsJWT()
  access_token: string;
}

class RefreshTokenRestResponse {
  @ApiProperty({
    description: 'The JWT access token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0MzE3MjA3LTdhMmYtNDg5ZC1hNjZiLTExMzExODlhZTdiMSIsImVtYWlsIjoiaXNhcXVlQGxvb21pLmNvbS5iciIsImlhdCI6MTY3ODcyMzQ3OSwiZXhwIjoxNjc4NzI3MDc5fQ.t6f1VZMvgktRBIX_yOueXNn5elRD7-Dho5i17zeJHmA',
  })
  access_token: string;
}

@ApiTags('Auth')
@Controller('auth/refresh-token')
@UseGuards(RefreshTokenGuard)
@Public()
export class RefreshTokenRestController {
  constructor(private readonly tokenService: JwtTokenService) {}

  @ApiOperation({
    summary: 'User get a new access token.',
    description:
      'Endpoint to user get a new access token using a expired access token.',
  })
  @ApiBody({
    type: RefreshTokenRestBody,
    required: true,
    description: 'RefreshToken requires access token expired.',
  })
  @ApiOkResponse({
    description: 'The user access token.',
    type: RefreshTokenRestResponse,
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
    @AuthUserParam() user: AuthUser,
  ): Promise<RefreshTokenRestResponse> {
    const accessToken = await this.tokenService.generate(user);

    return {
      access_token: accessToken,
    };
  }
}

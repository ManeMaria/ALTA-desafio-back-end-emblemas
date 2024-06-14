import { User, UserEntity } from '@/users/domain';
import { IController } from '@/core/interface';
import { AutoValidator } from '@/libs/class-validator';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';
import { Email, EmailState, EmailTemplate } from '@/notifications/domain';
import {
  CreateEmailUseCase,
  IEmailRepository,
  IEmailService,
  IEmailTemplateRepository,
} from '@/notifications/application';

export type TCreateEmailRequest = {
  from: Email['from'];
  to: Email['to'];
  tag: EmailTemplate['tag'];
  userId?: User['id'];
  data?: Record<string, string>;
};

export type TCreateEmailResponse = Pick<Email, 'id' | 'state' | 'from' | 'to'>;

export class CreateEmailRequest
  extends AutoValidator
  implements TCreateEmailRequest
{
  @IsEmail()
  from: Email['from'];

  @IsEmail()
  to: Email['to'];

  @IsString()
  @MaxLength(255)
  tag: EmailTemplate['tag'];

  @IsOptional()
  @IsUUID(4)
  userId?: User['id'];

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;

  constructor(props: TCreateEmailRequest) {
    super(props);
  }
}

export class CreateEmailResponse
  extends AutoValidator
  implements TCreateEmailResponse
{
  @IsUUID(4)
  id: string;

  @IsEnum(EmailState)
  state: EmailState;

  @IsString()
  @Length(1, 255)
  from: Email['from'];

  @IsString()
  @Length(1, 255)
  to: Email['to'];

  constructor(props: TCreateEmailResponse) {
    super(props);
  }
}

export class CreateEmailController
  implements IController<TCreateEmailRequest, TCreateEmailResponse>
{
  private usecase: CreateEmailUseCase;

  constructor(
    emailTemplateRepositorty: IEmailTemplateRepository,
    emailRepository: IEmailRepository,
    emailService: IEmailService,
  ) {
    this.usecase = new CreateEmailUseCase(
      emailTemplateRepositorty,
      emailRepository,
      emailService,
    );
  }

  async execute(request: TCreateEmailRequest): Promise<TCreateEmailResponse> {
    const user = new UserEntity({ id: request.userId });

    const emailCreated = await this.usecase.perform({
      tag: request.tag,
      to: request.to,
      from: request.from,
      user,
      data: request.data,
    });

    return new CreateEmailResponse({
      id: emailCreated.id,
      state: emailCreated.state,
      from: emailCreated.from,
      to: emailCreated.to,
    });
  }
}

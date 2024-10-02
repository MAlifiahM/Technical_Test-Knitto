import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserProvider } from './user-provider.enum';
import { UserRoles } from './user-role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEnum(UserProvider)
  @IsNotEmpty()
  readonly provider: UserProvider;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  readonly role: UserRoles;
}

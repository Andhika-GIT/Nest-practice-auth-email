import { CreateUserDto } from './create-user';
import { PartialType } from "@nestjs/swagger"

export class UpdateUserDto extends PartialType(CreateUserDto) {}
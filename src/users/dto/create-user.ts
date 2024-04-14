import { IsEmail, IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum([ "INTERN" , "ENGINEER" , "ADMIN"], {
        message: 'Valid Role Required'
    })
    role : "INTERN" | "ENGINEER" | "ADMIN"
}
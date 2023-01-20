import { IsString, IsEmail, Length, IsNotEmpty }  from "class-validator";

export class SignupDto {

    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    readonly username : string;

    @IsEmail()
    readonly email : string;
    
    @IsString()
    @IsNotEmpty()
    @Length(8, 30)
    readonly password : string;
}
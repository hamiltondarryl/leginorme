import { Body, Controller, Get, Post, Render} from '@nestjs/common';
import { SignupDto } from 'src/dtos/signupDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}

    @Get('/signup')
    @Render('user/signup')
    signup(){}

    @Get('/signin')
    @Render('user/signin')
    signin(){}

    @Post('/signup')
    signupPost(@Body() body : SignupDto){
        return this.userService.signupPost(body);
    }

}

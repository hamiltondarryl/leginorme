import { Body, Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(@Res() res, @Param('name') name : string ){
    return res.render('auth/index', { name : name})
  }
}

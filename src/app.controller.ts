import { Body, Controller, ForbiddenException, Get, Logger, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  private logger: Logger;

  constructor(
    private readonly appService: AppService
  ) {
    this.logger = new Logger(AppController.name);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('whatsapp/:number')
  sendWhatsapp(@Param() params) {
    this.appService.send(params.id);
  }

  @Post('webhook')
  webhook(@Body() body) {
    if(body.object ==='page'){
      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });

      return 'EVENT_RECEIVED';    
    }
    else {
      throw new NotFoundException();
    }
  }

  @Get('webhook')
  getWebhook(@Query() query) {
    let VERIFY_TOKEN = "DFORGE_TOKEN";
    let mode = query['hub.mode'];
    let token = query['hub.verify_token'];
    let challenge = query['hub.challenge'];

    this.logger.log(`${mode}, ${token}`)
    if(mode && token){
      if( mode === 'subscribe' && token === VERIFY_TOKEN) {
        this.logger.log('WEBHOOK_VERIFIED');
        return challenge;
      }
      else {
        this.logger.log('forbidden!')
        throw new ForbiddenException();
      }
    }
  }
}

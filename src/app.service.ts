import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';


@Injectable()
export class AppService {

  client;

  constructor(
    private configService: ConfigService
  ){
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.client = Twilio(accountSid, authToken);
  }
  getHello(): string {
    return 'Hello World!';
  }

  send(destNumber: string,) {
    // Download the helper library from https://www.twilio.com/docs/node/install
    this.client.messages
      .create({
        from: 'whatsapp:+552120420682',
        body: 'Your appointment is coming up on July 21 at 3PM',
        to: `whatsapp:${destNumber}`
      })
      .then(message => console.log(message.sid));

  }
}

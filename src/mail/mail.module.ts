import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./mail.service";
import { join } from "path/win32";
import { EjsAdapter } from "@nestjs-modules/mailer/adapters/ejs.adapter.js";

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get<string>("SMTP_HOST"),
            port: config.get<number>("SMTP_PORT"),
            secure: false, // true for 465, false for other ports
            auth: {
              user: config.get<string>("SMTP_USERNAME"),
              pass: config.get<string>("SMTP_PASSWORD"),
            },
          },
          template: {
            dir: join(__dirname, "templates"),
            adapter: new EjsAdapter({inlineCssEnabled: true}),
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
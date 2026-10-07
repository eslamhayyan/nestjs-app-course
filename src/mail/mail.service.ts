import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}


  /**
   * send login email to the user after successful login
   * @param email logged in user's email
   */
  public async sendLoginEmail(email: string){
    try {
      const date = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: "<no-reply@my-nest-app.com>",
        subject: "Login Notification",
        html: `<div>
          <h2>Hello ${email}</h2>
          <p>
            You have successfully logged in to your account ${email} in ${date.toDateString()} at ${date.toLocaleTimeString()}.
          </p>
        </div>`,
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        "Failed to send login email. Please try again later.",
      );
    }
  }
}
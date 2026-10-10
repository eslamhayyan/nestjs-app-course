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
    const today = new Date();
    try {
      await this.mailerService.sendMail({
        to: email,
        from: "<no-reply@my-nest-app.com>",
        subject: "Login Notification",
        template: 'login',
        context: {email, today},
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        "Failed to send login email. Please try again later.",
      );
    }
  }

  
  /**
   * verify email template to send verification email to the user
   * @param email email of the user to send verification email
   * @param link link with id of the user and verification token to verify the email
   */
  public async sendVerifyEmailTemplate(email: string, link: string){
    try {
      await this.mailerService.sendMail({
        to: email,
        from: "<no-reply@my-nest-app.com>",
        subject: "Email Verification",
        template: 'verify-email',
        context: {email, link},
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        "Failed to send verification email. Please try again later.",
      );
    }
  }


  /**
   * reset password template to send reset password email to the user
   * @param email email of the user to send reset password email
   * @param resetPasswordLink reset password link with id of the user and reset password token to reset the password
   */
  public async resetPasswordTemplate(email: string, resetPasswordLink: string){
    try {
      await this.mailerService.sendMail({
        to: email,
        from: "<no-reply@my-nest-app.com>",
        subject: "Reset Password",
        template: 'reset-password',
        context: {resetPasswordLink},
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        "Failed to send reset password email. Please try again later.",
      );
    }
  }
}
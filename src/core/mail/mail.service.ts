import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import type { AppConfig } from '@/config';
import { LoggerService } from '@/core/logger';

import type { SendMailInput } from './mail.types';

@Injectable()
export class MailService {
  //
  private readonly client: Resend;
  private readonly from: string;

  constructor(config: ConfigService<AppConfig, true>, private readonly logger: LoggerService,) {
    const mail = config.get('mail', { infer: true });
    this.from = mail.from;
    //
    this.client = new Resend(mail.apiKey);
  }

  async send(input: SendMailInput): Promise<void> {
    try {
      const { data, error } = await this.client.emails.send({
        from: this.from,
        to: typeof input.to === 'string' ? [input.to] : input.to,
        subject: input.subject,
        html: input.html,
        ...(input.text !== undefined && {
          text: input.text,
        }),
        ...(input.replyTo !== undefined && {
          replyTo: input.replyTo,
        }),
      });
      //
      if (error) {
        this.logger.error(
          error.message,
          undefined,
          MailService.name,
        );
        throw new Error(`Failed to send email: ${error.message} `);
      }
      this.logger.log(
        `Email sent successfully: ${data?.id ?? 'unknown'} `,
        MailService.name,
      );
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error.message : 'Failed to send email.',
        error instanceof Error ? error.stack : undefined,
        MailService.name,
      );
      throw error;
    }
  }
}
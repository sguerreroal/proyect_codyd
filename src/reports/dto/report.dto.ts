import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class ReportDto {
  @JoiSchema(Joi.string().required())
  email: string;
  @JoiSchema(Joi.string().required())
  password: string;
  @JoiSchema(Joi.string().required())
  client_name: string;
  @JoiSchema(Joi.number().required())
  client_id: string;
  @JoiSchema(Joi.string().required())
  metrics: string;
  @JoiSchema(Joi.string().required())
  since: string;
  @JoiSchema(Joi.string().required())
  until: string;
}

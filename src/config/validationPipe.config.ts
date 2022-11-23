import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

const config: ValidationPipeOptions = {
  validationError: { target: true, value: true },
  whitelist: true,
  transform: true,
  stopAtFirstError: true,
  exceptionFactory(errors) {
    const error: {
      [key: string]: {
        message: string;
        value: any;
      };
    } = {};

    errors.forEach((validationError) => {
      const { property, value, constraints } = validationError;
      let message = '';
      if (constraints) message = Object.values(constraints).join(' ').trim();
      error[property] = { message, value };
    });

    return new BadRequestException({ validationErrors: error });
  },
};

export default config;

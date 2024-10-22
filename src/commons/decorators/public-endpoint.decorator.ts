import { applyDecorators, UseGuards } from '@nestjs/common';
import { IsPublicEndPoint } from '../guards/public-endpoint.guard';

export const Public = () => {
  return applyDecorators(IsPublicEndPoint(true));
};

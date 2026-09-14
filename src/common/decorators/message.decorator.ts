import { SetMetadata } from '@nestjs/common';

import { MESSAGE_ROUTE_KEY } from '../constants';

export const ApiMessage = (message: string) => SetMetadata(MESSAGE_ROUTE_KEY, message);

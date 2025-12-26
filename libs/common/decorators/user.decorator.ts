import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@app/common/models/user.schema';

function getCurrentUserByContext(context: ExecutionContext): UserDocument {
  return context.switchToHttp().getRequest().user;
}
export const User = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request.method === 'OPTIONS') {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            console.error('Auth Error:', err);
            console.error('Auth Info:', info);
            throw err || new Error('No autorizado');
        }
        return user;
    }
}

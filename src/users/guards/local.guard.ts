import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local'){
    canActivate(context: ExecutionContext){
        return super.canActivate(context)
    }
}
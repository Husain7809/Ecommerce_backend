

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';


@Injectable()
export class NameGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();
        const formData = request.body;
        // const name = formData['name'];
        // const category = formData['category'];

        console.log(formData);


        return false;
    }

}

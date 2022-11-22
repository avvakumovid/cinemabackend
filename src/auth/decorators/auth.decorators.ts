import { TypeRole } from '../auth.interface';
import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './../guards/jwt.guards';
import { OnlyAdminGuard } from './../guards/admin.guards';

export function Auth(role: TypeRole = 'user') {
    return applyDecorators(
        role === 'admin'
            ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
            : UseGuards(JwtAuthGuard))
}
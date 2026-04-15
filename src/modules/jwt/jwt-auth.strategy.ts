import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // берём из header
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
        })
    }

    async validate(payload: any) {
        return { userId: payload.sub } // попадёт в req.user
    }
}
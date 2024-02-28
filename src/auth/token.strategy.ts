import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-http-bearer'
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const user = await this.authService.findUserByToken(token);
    if (user == null) {
      throw new UnauthorizedException();
    }
    // Ha a tokenhez van lejárati idő, azt is itt tudjuk ellenőrizni
    // Pl. "validUntil" oszlop segítségével
    return user;
  }
}

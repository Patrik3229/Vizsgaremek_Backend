import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-http-bearer'
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly jwt : JwtService) {
    super();
  }

  /**
   * token validátor
   * @param token 
   * @returns user vagy null
   */
  async validate(token: string) {
    const user = await this.authService.validateToken(token);
    if (user == null) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

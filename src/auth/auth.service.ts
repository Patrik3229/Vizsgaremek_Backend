import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService, private readonly jwt: JwtService) { }

  /**
   * jwt token generáltor
   * @param user 
   * @returns jwt token
   */
  async generateTokenFor(user: Users) {
    /**ezeket az adatokat tesszük bele a token-be */
    const payload = { sub: user.id, username: user.email }
    return await this.jwt.signAsync(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: "2h"
    });
  }

  /**
   * token elelenörző
   * @param token 
   * @returns ha helyes akkor usert különben null
   */
  async validateToken(token: string) {
    if (!token) {
      return null
    }
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET
      })
      return await this.db.users.findUniqueOrThrow({
        where: { id: payload.sub }
      })
    } catch {
      return null
    }
  }
}

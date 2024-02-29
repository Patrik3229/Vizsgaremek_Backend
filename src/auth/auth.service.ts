import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (private readonly db: PrismaService, private readonly jwt : JwtService) {}

  async generateTokenFor(user: Users) {
    /** */
    const payload = {sub : user.id, username : user.email}
    return await this.jwt.signAsync(payload, {
      secret : process.env.TOKEN_SECRET,
      expiresIn : "2h"
    });
  }

  async validateToken(token: string) {
    if(!token){
      return null
    }
    try{
      const payload = await this.jwt.verifyAsync(token, {
        secret : process.env.TOKEN_SECRET
      })
      return await this.db.users.findUniqueOrThrow({
           where: { id: payload.sub }
         })
    } catch {
      return null
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AuthService {
  constructor (private readonly db: PrismaService) {}

  async generateTokenFor(user: Users) {
    const randomBuffer = randomBytes(32);
    const randomString = randomBuffer.toString('hex');

    await this.db.token.create({
      data: {
        token: randomString,
        user_id: user.id,
      }
    })

    return randomString;
  }

  async findUserByToken(token: string) {
    const tokenObj = await this.db.token.findUnique({
      where: { token }
    })
    if (tokenObj == null) {
      return null;
    }
    return await this.db.users.findUniqueOrThrow({
      where: { id: tokenObj.user_id }
    })
  }
}

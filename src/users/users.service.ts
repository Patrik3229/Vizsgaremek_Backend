import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  findByEmail(email: string) {
    return this.db.users.findUnique({
      where: { email }
    })
  }

  //password hashing
  async passwordHash(password : string) {
    const secret = await argon2.hash(password)
    return secret
  }
  
  create(createUserDto: CreateUserDto, secret : string) {
    return this.db.users.create({
      data : {
        email : createUserDto.email,
        name : createUserDto.name,
        password : secret,
        role : 'user'
      }
    })
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

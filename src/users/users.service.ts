import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";


@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }

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
    return this.db.users.findMany();
  }

  findOne(id: number) {
    return this.db.users.findUniqueOrThrow({
      where: { id }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.users.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password: updateUserDto.password,
      }
    })
  }

  updateRole(id: number, updateUserDto: UpdateUserDto) {
    return this.db.users.update({
      where: { id },
      data: {
        role: updateUserDto.role
      }
    })
  }

  remove(id: number) {
    return this.db.users.delete({
      where: { id }
    })
  }

  removeManager(id: number) {
    return this.db.users.delete({
      where: { id }
    })
  }
}

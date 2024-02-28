import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }

  findByEmail(email: string) {
    return this.db.users.findUnique({
      where: { email }
    })
  }

  create(createUserDto: CreateUserDto) {
    return this.db.users.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password
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

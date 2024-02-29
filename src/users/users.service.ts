import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { verify } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  findByEmail(email: string) {
    return this.db.users.findUnique({
      where: { email }
    })
  }

  secretPassword(password : string) {
    return 'hashed password'  
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

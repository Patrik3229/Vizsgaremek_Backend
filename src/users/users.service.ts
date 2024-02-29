import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  /**
   * email szerint kereső
   * @param email 
   * @returns user adatait
   */
  findByEmail(email: string) {
    return this.db.users.findUnique({
      where: { email }
    })
  }

  /**
   * jelszó titkosítás
   * @param password 
   * @returns hash jelszót
   */
  async passwordHash(password : string) {
    /**megadott password hash-eli */
    const secret = await argon2.hash(password)
    return secret
  }
  
  /**
   * új User add hozzá
   * @param createUserDto 
   * @param secret 
   * @returns új felhasználót
   */
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

  /**
   * user listázó
   * @returns minden létező user-t
   */
  findAll() {
    return `This action returns all users`;
  }

  /**
   * user keresés
   * @param id 
   * @returns 1 user
   */
  findOne(id: number) {
    /**id szerint van a search */
    return `This action returns a #${id} user`;
  }

  /**
   * user frissítés
   * @param id 
   * @param updateUserDto 
   * @returns a módosított adatok
   */
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * user törlést
   * @param id 
   * @returns törlést
   */
  remove(id: number) {
    /**id szerint törlünk */
    return `This action removes a #${id} user`;
  }
}

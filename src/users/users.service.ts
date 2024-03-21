import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";
import { roleUpdateDto } from './dto/role-update.dto';


@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }

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
   * role kereső id szerint
   * @param id 
   * @returns a felhasznaló role-jat
   */
  getRole(id: number) {
    return this.db.users.findUnique({
      where: { id },
      select: {
        password: false,
        email: false,
        id: false,
        name: false
      }
    })
  }

  /**
   * nev szerint kikeres
   * @param name 
   * @returns user adatokat
   */
  findByName(name: string) {
    /**findmany mivel a nevek egyezhetnek */
    return this.db.users.findMany({
      where: {
        name: {
          contains: name
        }
      }
    })
  }

  /**
   * jelszó titkosítás
   * @param password 
   * @returns hash jelszót
   */
  async passwordHash(password: string) {
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
  create(createUserDto: CreateUserDto, secret: string) {
    return this.db.users.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.username,
        password: secret,
        role: 'user'

      }
    })
  }

  searchAdmin(id: number, string : string) {
    return this.db.users.findMany({
      where: {
        NOT: {
          id : id
        },
        name : {
          contains : string
        },
        email : {
          contains : string
        }
      },
      select: {
        password: false
      }
    })
  }

  /**
   * user listázó
   * @returns minden létező user-t kivétel saját magát
   */
  findAll(id: number) {
    return this.db.users.findMany({
      where: {
        NOT: {
          id
        }
      },
      select: {
        password: false
      }
    });
  }

  /**
   * user keresés
   * @param id 
   * @returns 1 user
   */
  findOne(id: number) {

    /**id szerint van a search */
    return this.db.users.findUnique({
      where: { id },
      select: {
        password: false
      }
    });

  }

  /**
   * user frissítés
   * @param id 
   * @param updateUserDto 
   * @returns a módosított adatok
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password != updateUserDto.passwordAgain) {
      throw new BadRequestException(`The passwords doesn't match`)
    }
    if ((updateUserDto.password == updateUserDto.passwordOld) && (updateUserDto.passwordAgain == updateUserDto.passwordOld)) {
      throw new BadRequestException('The passowrd is the same as the previous')
    }

    return this.db.users.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.username,
        password: await this.passwordHash(updateUserDto.password),
      },
      select: {
        password: false
      }
    })
  }

  /**
   * user frissítés admin
   * @param id 
   * @param updateUserDto 
   * @returns a módosított adatok
   */
  updateRole(id: number, roleUpdate: roleUpdateDto) {
    return this.db.users.update({
      where: { id },
      data: {
        role: roleUpdate.role
      }
    })
  }

  /**
   * user törlést
   * @param id 
   * @returns törlést
   */
  remove(id: number) {
    /**id szerint törlünk */
    return this.db.users.delete({
      where: { id }
    })
  }
}

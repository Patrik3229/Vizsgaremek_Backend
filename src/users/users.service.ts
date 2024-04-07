import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";
import { roleUpdateDto } from './dto/role-update.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';


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
        name: false,
        role: true
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
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
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
  async create(createUserDto: CreateUserDto, secret: string) {
    return await this.db.users.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.username,
        password: secret,
        role: 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
      }
    })
  }

  /**
   * név szerinti keresés
   * @param id user id adminé
   * @param string keresendő szöveg
   * @returns user vagy user tartalmazó lista
   */
  async searchAdmin(id: number, string: string) {
    return await this.db.users.findMany({
      where: {
        NOT: {
          id: id
        },
        OR: [
          {
            name: {
              contains: string
            }
          },
          {
            email: {
              contains: string
            }
          }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
      }
    })
  }

  /**
   * user listázó
   * @param id user id
   * @returns minden létező user-t kivétel saját magát
   */
  async findAll(id: number) {
    return await this.db.users.findMany({
      where: {
        NOT: {
          id: id
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
      }
    });
  }

  /**
   * user keresés
   * @param id user id-ja
   * @returns 1 user
   */
  async findOne(id: number) {
    /**id szerint van a search */
    return await this.db.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
      }
    });

  }

  /**
   * user frissítés
   * @param id user id-ja
   * @param updateUserDto modosítandó adatok 
   * @returns a módosított adatok
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    let update
    if (updateUserDto.password != null && updateUserDto.passwordAgain != null && updateUserDto.passwordOld != null) {
      if (updateUserDto.password != updateUserDto.passwordAgain) {
        throw new BadRequestException(`The passwords don't match`)
      }
      if ((updateUserDto.password == updateUserDto.passwordOld) && (updateUserDto.passwordAgain == updateUserDto.passwordOld)) {
        throw new BadRequestException('The new password is same as the previous')
      }
      update = await this.db.users.update({
        where: { id },
        data: {
          password: await this.passwordHash(updateUserDto.password),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
    }
    if (updateUserDto.username != null) {
      update = await this.db.users.update({
        where: { id },
        data: {
          name: updateUserDto.username
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
    }
    if (updateUserDto.email != null) {
      update = await this.db.users.update({
        where: { id },
        data: {
          email: updateUserDto.email
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
    }
    return update
  }

  async updateAdmin(id: number, updateUserDto: UpdateAdminDto) {
    let update
    if (updateUserDto.email != null) {
      update = await this.db.users.update({
        where: { id },
        data: {
          email: updateUserDto.email
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
    }
    if (updateUserDto.password != null) {
      update = await this.db.users.update({
        where: { id },
        data: {
          password: await this.passwordHash(updateUserDto.password)
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
    }
    if (updateUserDto.username != null) {
      update = await this.db.users.update({
        where: { id },
        data: {
          name: updateUserDto.username
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: false
        }
      })
      if (updateUserDto.role != null) {
        update = await this.updateRole(id, updateUserDto.role)
      }
    }
    return update
  }

  /**
   * user frissítés admin
   * @param id user id-ja
   * @param roleUpdate új role 
   * @returns a módosított adatok
   */
  async updateRole(id: number, role: string) {
    return await this.db.users.update({
      where: { id },
      data: {
        role: role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
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
    console.log("**********User" + id)
    return this.db.users.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false
      }
    })
  }
}

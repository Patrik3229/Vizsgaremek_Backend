import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from "argon2";


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
   * nev szerint kikeres
   * @param name 
   * @returns user adatokat
   */
  findByName(name : string) {
    /**findmany mivel a nevek egyezhetnek */
    return this.db.users.findMany({
      where : {
        name : {
          contains : name
        }
      },
      select : {
        id : true,
        email : true,
        name : true,
        role : true
      }
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
        name : createUserDto.username,
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
    return this.db.users.findMany({
      select : {
        password : false
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
      where : {id}
    });

  }

  /**
   * user frissítés
   * @param id 
   * @param updateUserDto 
   * @returns a módosított adatok
   */
  update(id: number, updateUserDto: UpdateUserDto) {
    if(updateUserDto.password != updateUserDto.passwordAgain){
      throw new BadRequestException('A jelszavak nem egyeznek!')
    }
    if((updateUserDto.password != updateUserDto.passwordOld) && (updateUserDto.passwordAgain != updateUserDto.passwordOld)){
      throw new BadRequestException('A jelsó megegyezik a régivel')
    }
    //regex
    return this.db.users.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.username,
        password: updateUserDto.password,
      }
    })
  }

  /**
   * user frissítés admin
   * @param id 
   * @param updateUserDto 
   * @returns a módosított adatok
   */
  updateRole(id: number, updateUserDto: UpdateUserDto) {
    return this.db.users.update({
      where: { id },
      data: {
        role: updateUserDto.role
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

  removeManager(id: number) {
    return this.db.users.delete({
      where: { id }
    })

  }
}

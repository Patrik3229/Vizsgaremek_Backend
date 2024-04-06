import { BadRequestException, Body, Controller, HttpException, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { verify } from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  /**
   * user bejelkeztetés
   * @param loginDto 
   * @returns jwt token
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    /**ki keresük a felhasználót email szerint */
    const user = await this.usersService.findByEmail(loginDto.email);
    /**ha nem létezik user */
    if (user == null) {
      throw new UnauthorizedException('Hibás email vagy jelszó!');
    }
    /**ha a jelszó nem jó */
    if (!await verify(user.password, loginDto.password)) {
      throw new UnauthorizedException('Hibás email vagy jelszó!');
    }
    /**ha minden helyes */
    return {
      token: await this.authService.generateTokenFor(user),
      user_id: user.id 
    }
  }
}

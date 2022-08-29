import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as authInterfaces from 'src/auth/models/auth.model';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/registration')
  async registration(@Body() registrationUserDto: RegistrationUserDto, @Res() res: Response): Promise<Response<authInterfaces.IRegistrationResponse>> {
    const registrationResponse: authInterfaces.IRegistrationResponse = await this.authService.registration(registrationUserDto)
    return res.status(registrationResponse.status).json({ message: registrationResponse.message })
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response): Promise<Response<authInterfaces.ILoginResponse>> {
    const loginResponse: authInterfaces.ILoginResponse = await this.authService.login(loginUserDto)
    if (loginResponse?.token) {
      return res.status(loginResponse.status).json({ token: loginResponse.token, message: loginResponse.message })
    }

    return res.status(loginResponse.status).json({ message: loginResponse.message })
  }
}

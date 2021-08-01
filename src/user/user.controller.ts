import { Body, Controller, Get, Post, Query, Delete, Patch,HttpStatus, Res, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { IUser } from './user.interface';
import { IOtherUser } from './other-user.interface'
import { UserService } from './user.service';
import { Response, Request } from 'express';
//import * as bcrypt from 'bcrypt';
//const saltOrRounds=10;
import { JwtService } from '@nestjs/jwt';

@Controller('users')
@ApiTags('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private jwtService:JwtService
  ){}

  @Post('register')
  @ApiCreatedResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser>{
    return await this.userService.createUser(createUserDto);
  }

  @Post('log-in')
  @ApiCreatedResponse()
  async logIn(@Body() logInDto: LogInDto, @Res({passthrough:true}) response:Response): Promise<any>{
    return await this.userService.logIn(logInDto, response);
  }

  @Get('user')
  @ApiOkResponse()
  async getUserInfo(@Req() request: Request){
    return await this.userService.getUserInfo(request);
  }

  @Get('other-user')
  @ApiOkResponse()
  async getOtherUserInfo(@Query() filter: FilterUserDto): Promise<any>{
    return await this.userService.getOtherUserInfo(filter);
  }

  @Post('log-out')
  @ApiOkResponse()
  async logOut(@Res({passthrough:true}) response:Response){
    return await this.userService.logOut(response);
  }

/*
  @Get('')
  @ApiOkResponse()
  async getUserInfo(@Query() filter: FilterUserDto): Promise<IUser>{
    return await this.userService.getUserInfo(filter);
  }
*/
  @Delete('delete')
  @ApiOkResponse()
  async deleteUser(@Req() request: Request, @Res() response: Response): Promise<any>{
    return await this.userService.deleteUser(request, response);
  }

  @Patch('update')
  @ApiOkResponse()
  async updateUser(@Req() request: Request, @Body() updateData): Promise <IUser>{
    return await this.userService.updateUser(request, updateData);
  }
}

import { Injectable,HttpStatus,HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { IUser } from './user.interface';
import { IOtherUser } from './other-user.interface';
import * as bcrypt from 'bcrypt';
import { Hash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { json, response } from 'express';
const saltOrRounds = 10;


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    if (!createUserDto.email||!createUserDto.name||!createUserDto.password){
      throw new HttpException('name, email, password required', HttpStatus.FORBIDDEN);
    }
    if (!await this.findOne({email:createUserDto.email}) && !await this.findOne({name:createUserDto.name}) ){
      const hashPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const newUser = createUserDto;
      newUser.password = hashPassword;
      const userModel = new this.userModel(newUser);
      return await userModel.save();
    }
    else{
      throw new HttpException('Email/Username existed', HttpStatus.FORBIDDEN);

    }
  }
  
  async findOne(filter): Promise<IUser>{
    return await this.userModel.findOne(filter).exec();
  }

  async logIn(filter, response): Promise<any>{
    const user=await this.findOne({"email":filter.email});
    if (!user){
      throw new HttpException('Unregistered email', HttpStatus.FORBIDDEN);
    }
    const isMatch = await bcrypt.compare(filter.password, user.password);
    if (!isMatch){
      throw new HttpException('Incorrect Password', HttpStatus.FORBIDDEN);
    }

    const jwt= await this.jwtService.signAsync({email:user.email});
    response.cookie('jwt',jwt, {httpOnly: true});
    return {
      message: 'logged in'
    };
  }

  async getUserInfo(request): Promise<any> {
    try{
      const cookie = request.cookies['jwt'];
      const data=await this.jwtService.verifyAsync(cookie);
      if (!data){
        throw new HttpException('Invalid data', HttpStatus.FORBIDDEN);
      }
      const user= await this.userModel.findOne({email:data["email"]});
      console.log(user);
      //delete user.password;
      const userInfo={
        name: user.name,
        email:user.email,
        age:user.age,
        phoneNumber:user.phoneNumber
      }
      return userInfo;
    }
    catch (error){
      throw new HttpException('log in first', HttpStatus.FORBIDDEN);
    }
  } 

  async logOut(response){
    response.clearCookie('jwt');
    return {
      message: "logged out"
    }
  }

  async getOtherUserInfo(filter): Promise<any> {
    console.log(typeof(filter));
    if (!filter) {
      return;
    }
    const otherUser= await this.userModel.findOne(filter).exec();
    if (!otherUser){
      throw new HttpException("User does not exist", HttpStatus.FORBIDDEN);
    }
    const otherUserInfo= {
      name: otherUser.name,
      email: otherUser.email,
      age: otherUser.age
    }
    return otherUserInfo;
  } 
  async deleteUser(request, response): Promise<any>{
    try{
      const cookie = request.cookies['jwt'];
      const data=await this.jwtService.verifyAsync(cookie);
      if (!data){
        throw new HttpException('Invalid data', HttpStatus.FORBIDDEN);
      }
      const user= await this.userModel.findOne({email:data["email"]});
      console.log("clear cookie");
      
      await this.userModel.findOneAndDelete({email:user.email});
      return await response.clearCookie('jwt');
    }
    catch (error){
      throw new HttpException('log in first', HttpStatus.FORBIDDEN);
    }
  }

  async updateUser(request, update={}): Promise<IUser>{
    try{
      const cookie = request.cookies['jwt'];
      const data=await this.jwtService.verifyAsync(cookie);
      if (!data){
        throw new HttpException('Invalid data', HttpStatus.FORBIDDEN);
      }
      const user= await this.userModel.findOne({email:data["email"]});
      //if user update password
      if (update["password"]){
        update["password"]= await bcrypt.hash(update["password"], saltOrRounds);
      }
      return await this.userModel.findOneAndUpdate({email:user.email}, update).exec();
    }
    catch (error){
      throw new HttpException('log in first', HttpStatus.FORBIDDEN);
    }
  }
}
/*
  async deleteUser(filter: FilterUserDto): Promise<any> {
    const user= await this.getUserInfo({email:filter.email});
    if (!user){
      throw new HttpException("User does not exist", HttpStatus.FORBIDDEN);
    }

    const isMatch = await bcrypt.compare(filter.password, user.password);
    if (isMatch){
      return await this.userModel.findOneAndDelete({email:filter.email});
    }
    else{
      throw new HttpException("Incorrect password", HttpStatus.FORBIDDEN);
    }
   }

   async updateUser(filter: FilterUserDto, update = {}): Promise<IUser> {
    
    const user= await this.getUserInfo({email:filter.email});
    if (!user){
      throw new HttpException("User does not exist", HttpStatus.FORBIDDEN);
    }
    const isMatch = await bcrypt.compare(filter.password, user.password);
    if (isMatch){
      //If user update password
      if (update["password"]){
        update["password"]= await bcrypt.hash(update["password"], saltOrRounds);
      }
      return await this.userModel.findOneAndUpdate({email:filter.email}, update).exec();
    }
    else{
      throw new HttpException("Incorrect password", HttpStatus.FORBIDDEN);
    }
  }
  
*/


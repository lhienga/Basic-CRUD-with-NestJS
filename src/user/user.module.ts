import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

const url = `mongodb+srv://admin:admin@cluster0.c2x41.mongodb.net/test?retryWrites=true&w=majority`

@Module({
  imports: [
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
    })
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
  @ApiProperty({example: 'Khanh Nguyen'})
  readonly name: string;
  @ApiProperty({example: 21})
  readonly age: string;
  @ApiProperty({example: 'test@gmail.com'})
  readonly email: string;
  @ApiProperty({example: 'somePassword'})
  password: string;
  @ApiProperty({example: '0123456789'})
  readonly phoneNumber: string;
}
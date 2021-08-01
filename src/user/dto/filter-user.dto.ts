import { ApiProperty } from "@nestjs/swagger";

export class FilterUserDto{
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string


}
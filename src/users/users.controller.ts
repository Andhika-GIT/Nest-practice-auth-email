import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user';
import { UpdateUserDto } from './dto/update-user';
import { UserDto } from './dto/user';
import { User } from './entities/user.entity';
import { LocalGuard } from './guards/local.guard';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guards/jwt.guard';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService  ) {}


   // --AUTH --
   @Post('signin')
   @UseGuards(LocalGuard)
    signin(@Request() req) {
     return this.authService.signIn(req.user)
   }


   @Post('signup')
    signup(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
   }

   @Get('info')
   @UseGuards(JwtGuard)
   getInfo(@Request() req){
    return req.user
   }
 
  

  @Serialize(UserDto)
  @Get() // GET /users
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    // /users?role=
    return this.usersService.findAll(role ? role : undefined);
  }

  @Serialize(UserDto)
  @Get(':id') // GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Serialize(UserDto)
  @Post() // POST /users
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Serialize(UserDto)
  @Patch(':id') // PATCH /users/id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) user: UpdateUserDto,
  ) {
    return this.usersService.update(id, user);
  }

  @Delete(':id') // DELETE /users/id
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }


 
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user';
import { SigninDto } from './dto/signIn-user';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(user: SigninDto) {
    const findUser = await this.usersService.findUser(user.email);

    // see if user give valid email
    if (!findUser) {
      throw new BadRequestException('invalid credential');
    }

    // if user email exist, take the stored hash and salt from user stored password in db
    const [salt, storedHash] = findUser.password.split('.');

    // creating a hash based on salt from user correct password and incoming req password
    const hash = (await scrypt(user.password, salt, 32)) as Buffer;

    // see if created hash is the same as the hash that stored in db
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credential');
    }

    return findUser;
  }

  async signUp(user: CreateUserDto) {
    // see if user with given exist
    const findUser = await this.usersService.findUser(user.email);

    if (findUser) {
      throw new BadRequestException('email already used');
    }

    // hashing password
    // -- generate salt
    const salt = randomBytes(8).toString('hex');

    // -- hash the salt and the password together
    const hash = (await scrypt(user.password, salt, 32)) as Buffer;

    // -- join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create and save new user
    const newUser = await this.usersService.create({
      ...user,
      password: result,
    });

    const payload = { email: findUser.email, role: findUser.role };
    const token = this.jwtService.sign(payload);

    return {
      status: 201,
      token: token,
    };
  }

  async signIn(user: User) {
    const payload = { email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      status: 201,
      token: token,
    };
  }

  async forgotPassword(email: string) {
    const findUser = await this.usersService.findUser(email);

    // see if user give valid email
    if (!findUser) {
      throw new BadRequestException('email not found');
    }

    const token = this.jwtService.sign({ email: findUser.email });
    const ResetURL = `localhost:3000/users/resetPassword?token=${token}`;

    return this.emailService.sendResetPassword({
      recipientEmail: findUser.email,
      recipientName: findUser.name,
      subject: 'RESET PASSWORD',
      URL: ResetURL,
    });
  }
}

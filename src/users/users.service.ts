import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { UpdateUserDto } from './dto/update-user';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN' | undefined): Promise<User[]> {
    return role
      ? this.userRepository.findAll({
          where: {
            role: role,
          },
        })
      : this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const selectedUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!selectedUser) {
      throw new NotFoundException('user not found');
    }

    return selectedUser;
  }
  async findUser(email: string): Promise<User | null> {
    const selectedUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return selectedUser || null;
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(user as any);

    await newUser.save();

    return newUser;
  }

  async update(id: number, updatedUser: UpdateUserDto): Promise<User> {
    const selectedUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!selectedUser) {
      throw new NotFoundException('User not found');
    }

    (await selectedUser.update(updatedUser)).save();

    return selectedUser;
  }

  async delete(id: number): Promise<string> {
    const selectedUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!selectedUser) {
      throw new NotFoundException('User not found');
    }

    return 'Sucessfully deleted user';
  }
}

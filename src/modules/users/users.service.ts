import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';
import { updateUserDto } from './dto/user-requests.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
  ) { }

  async update(
    userId: string,
    updateUserDto: updateUserDto
  ) {
    const userDb = await this.usersRepo.findOne(userId)
    if (!userDb) {
      throw new NotFoundException('User not found')
    }
    return await this.usersRepo.updateUser(userDb.id, updateUserDto)
  }


  async findAll(
    take: number,
    skip: number,
    user: User
  ) {
    if (user.role === "USER") {
      throw new ForbiddenException({ message: "You don't have a permission" })
    }
    return this.usersRepo.findManyUsers(
      take,
      skip
    )
  }


  async findOne(
    id: string,
    user: User
  ) {
    if (user.role === "USER") {
      throw new ForbiddenException({ message: "You don't have a permission" })
    }
    const userDb = await this.usersRepo.findOne(id)
    if (!userDb) {
      throw new NotFoundException({ message: "User not found" })
    }
    return userDb
  }


  async findMyself(
    userId: string
  ) {
    const userDb = await this.usersRepo.findOne(userId)
    if (!userDb) {
      throw new NotFoundException({ message: "User not found" })
    }
    return userDb
  }


  async remove(
    id: string,
    req: any
  ) {
    const currentUser = req.user
    if (currentUser.role === "USER") {
      throw new ForbiddenException({ message: "You don't have a permission" })
    }
    const user = await this.usersRepo.findUserById(id)
    if (!user) {
      throw new NotFoundException({ message: "User not found" })
    }
    await this.usersRepo.deleteOne(id);
    return;
  }
}

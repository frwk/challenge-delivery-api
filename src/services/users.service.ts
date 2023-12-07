import { hash } from 'bcryptjs';
import { Service } from 'typedi';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/HttpException';
import User from '@/models/users.model';
import Courier from '@/models/couriers.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await User.findAll({ paranoid: false });
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findByPk(userId, { paranoid: false });
    if (!findUser) throw new HttpException(404, "User doesn't exist");
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await User.findOne({ where: { email: userData.email }, raw: true, nest: true });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await User.create({ ...userData });
    return createUserData;
  }

  public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");
    const updatedUser = await findUser.update(userData);
    if (userData.courier) {
      const courier = await updatedUser.getCourier();
      if (!courier) throw new HttpException(404, "Courier doesn't exist");
      await courier.update(userData.courier);
    }
    return findUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    await User.destroy({ where: { id: userId } });

    return findUser;
  }
}

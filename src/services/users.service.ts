import { Service } from 'typedi';
import { SignupDto, UpdateUserAsAdminDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/HttpException';
import User from '@/models/users.model';
import Courier from '@/models/couriers.model';
import { Attributes, FindOptions } from 'sequelize';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await User.findAll({ paranoid: false });
    return allUser;
  }

  public async findUserById(userId: number, options?: FindOptions<Attributes<User>>): Promise<User> {
    const findUser: User = await User.findByPk(userId, options);
    if (!findUser) throw new HttpException(404, "User doesn't exist");
    return findUser;
  }

  public async createUser(userData: SignupDto): Promise<User> {
    const findUser: User = await User.findOne({ where: { email: userData.email }, raw: true, nest: true });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await User.create({ ...userData });
    return createUserData;
  }

  public async updateUser(userId: number, userData: UpdateUserAsAdminDto | UpdateUserDto): Promise<User> {
    const findUser: User = await User.findByPk(userId, { include: [{ model: Courier }] });
    if (!findUser) throw new HttpException(404, "User doesn't exist");
    const updatedUser = await findUser.update(userData);
    if (userData.courier) {
      const courier = await findUser.courier;
      if (!courier) throw new HttpException(404, "Courier doesn't exist");
      await courier.update(userData.courier);
    }
    return updatedUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    await User.destroy({ where: { id: userId } });

    return findUser;
  }
}

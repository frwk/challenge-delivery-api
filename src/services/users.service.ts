import { hash } from 'bcryptjs';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/HttpException';
import User from '@/models/users.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await User.findAll();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await User.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await User.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

    const updateUser: User = await User.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await User.destroy({ where: { id: userId } });

    return findUser;
  }
}

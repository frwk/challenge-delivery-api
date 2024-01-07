import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import 'dotenv/config';
import { HttpException } from '@/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import User from '@/models/users.model';
import { Roles } from '@/enums/roles.enum';
import Courier from '@/models/couriers.model';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    id: user.id,
    firstname: user.firstName,
    lastname: user.lastName,
    email: user.email,
    role: user.role as keyof typeof Roles,
  };
  const expiresIn: number = 7 * 24 * 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, process.env.SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}; Secure; SameSite=Lax; ${
    process.env.NODE_ENV === 'production' ? `domain=${process.env.FRONTEND_URL.split('.').slice(-2).join('.')}` : ''
  }`;
};

@Service()
export class AuthService {
  public async signup(userData: SignupDto): Promise<User> {
    const findUser: User = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await User.create({ ...userData });

    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await User.findOne({
      attributes: { include: ['password'] },
      where: { email: userData.email },
      include: [{ model: Courier }],
    });
    if (!findUser) throw new HttpException(401, `Invalid credentials`);
    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Password not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await User.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}

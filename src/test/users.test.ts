import request from 'supertest';
import { UserService } from '@services/users.service';
import { App } from '../app';
import { UserRoute } from '@/routes/users.route';
import { Container } from 'typedi';
import UserMongo from '@/database/mongo/models/User';
import { migrator } from '@/database/umzug';
import User from '@/models/users.model';
import { Roles } from '@/enums/roles.enum';

jest.mock('../middlewares/auth.middleware.ts', () => ({
  AuthMiddleware: (...roles) => {
    return async (req, res, next) => {
      req.user = { id: 1, role: Roles.ADMIN };
      next();
    };
  },
}));

describe('Integration tests for user', () => {
  let app;
  beforeAll(async () => {
    Container.set(UserService, new UserService());
    app = new App([new UserRoute()]);
    await app.initialize();
    await migrator.up();
  });

  afterEach(async () => {
    await User.destroy({ where: {}, force: true });
    await UserMongo.deleteMany({});
  });

  afterAll(async () => {
    await migrator.down({ to: 0 as const });
  });

  describe('GET /users/:id', () => {
    it('should return a user', async () => {
      const newUser = { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' };
      const resNewUser = await request(app.getServer()).post('/users').send(newUser);
      const res = await request(app.getServer()).get(`/users/${resNewUser.body.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', resNewUser.body.id);
    });
    it('should return 404 for a non-existing user ID', async () => {
      const res = await request(app.getServer()).get(`/users/1`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "User doesn't exist");
    });
  });

  describe('GET /users', () => {
    it('should return an empty array when there are no users', async () => {
      const res = await request(app.getServer()).get('/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
    it('should return an array with the correct users when there are some users', async () => {
      const userData = [
        { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' },
        { firstName: 'john1', lastName: 'doe1', email: 'test1@user.com', password: 'password123' },
      ];
      const postResponses = await Promise.all(userData.map(data => request(app.getServer()).post('/users').send(data)));
      postResponses.forEach(res => expect(res.statusCode).toEqual(201));
      const res = await request(app.getServer()).get('/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' };
      const res = await request(app.getServer()).post('/users').send(newUser);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
    it('should return 409 for an existing user', async () => {
      const newUser = { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' };
      await request(app.getServer()).post('/users').send(newUser);
      const res = await request(app.getServer()).post('/users').send(newUser);
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', `This email ${newUser.email} already exists`);
    });
    it('should return 400 for invalid user data', async () => {
      const invalidCourier = { firstName: 'john', lastName: 'doe', email: 'testuser.com', password: 'password123' };
      const res = await request(app.getServer()).post('/users').send(invalidCourier);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'email must be an email');
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const newUser = { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' };
      const resNewUser = await request(app.getServer()).post('/users').send(newUser);
      const userData = { firstName: 'jean' };
      const res = await request(app.getServer()).patch(`/users/${resNewUser.body.id}`).send(userData);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 404 for a non-existing user ID', async () => {
      const userData = { firstName: 'jean' };
      const res = await request(app.getServer()).patch('/users/1').send(userData);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "User doesn't exist");
    });
    it('should return 400 for invalid update data', async () => {
      const courierId = 1;
      const invalidUserData = { firstName: 50 };
      const res = await request(app.getServer()).patch(`/users/${courierId}`).send(invalidUserData);
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const newUser = { firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' };
      const resNewUser = await request(app.getServer()).post('/users').send(newUser);
      const res = await request(app.getServer()).delete(`/users/${resNewUser.body.id}`);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 404 for a non-existing user ID', async () => {
      const courierId = 20000000000;
      const res = await request(app.getServer()).delete(`/users/${courierId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "User doesn't exist");
    });
  });
});

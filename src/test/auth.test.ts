import request from 'supertest';
import { CourierService } from '@services/couriers.service';
import { App } from '../app';
import { AuthRoute } from '@/routes/auth.route';
import { Container } from 'typedi';
import UserMongo from '@/database/mongo/models/User';
import { migrator } from '@/database/umzug';
import User from '@/models/users.model';

describe('Integration tests for authentication', () => {
  let app;
  beforeAll(async () => {
    Container.set(CourierService, new CourierService());
    app = new App([new AuthRoute()]);
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

  describe('[POST] /auth/login', () => {
    it('should login successfully', async () => {
      const userData = { firstName: 'john', lastName: 'doe', email: 'john@doe.com', password: 'password123' };
      const signupResult = await request(app.getServer()).post('/auth/signup').send(userData);
      expect(signupResult.status).toBe(201);
      const result = await request(app.getServer()).post('/auth/login').send({ email: userData.email, password: userData.password });
      expect(result.status).toBe(200);
      expect(result.headers['set-cookie']).toBeDefined();
    });
    it('should return 401 when user does not exists', async () => {
      const userData = { email: 'john@doe.com', password: 'password123' };
      const result = await request(app.getServer()).post('/auth/login').send(userData);
      expect(result.status).toBe(401);
      expect(result.headers['set-cookie']).toBeUndefined();
    });
    it('should return 401 when data is invalid', async () => {
      const userData = { email: 'johndoe.com', password: 'password123' };
      const result = await request(app.getServer()).post('/auth/login').send(userData);
      expect(result.status).toBe(400);
      expect(result.headers['set-cookie']).toBeUndefined();
    });
  });

  describe('[POST] /auth/signup', () => {
    it('should register successfully', async () => {
      const userData = { firstName: 'john', lastName: 'doe', email: 'john@doe.com', password: 'password123' };
      const result = await request(app.getServer()).post('/auth/signup').send(userData);
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty('id');
    });
    it('should return 409 when email already exists', async () => {
      const userData = { firstName: 'john', lastName: 'doe', email: 'john@doe.com', password: 'password123' };
      await request(app.getServer()).post('/auth/signup').send(userData);
      const res = await request(app.getServer()).post('/auth/signup').send(userData);
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', `This email ${userData.email} already exists`);
    });
    it('should return 400 for invalid register data', async () => {
      const invalidCourier = { firstName: 'john', lastName: 'doe', email: 'testuser.com', password: 'password123' };
      const res = await request(app.getServer()).post('/auth/signup').send(invalidCourier);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'email must be an email');
    });
  });

  describe('[POST] /auth/logout', () => {
    it('should logout successfully', async () => {
      const agent = request.agent(app.getServer());

      const userData = { firstName: 'john', lastName: 'doe', email: 'john@doe.com', password: 'password123' };
      const signupResult = await request(app.getServer()).post('/auth/signup').send(userData);
      expect(signupResult.status).toBe(201);

      const loginResult = await agent.post('/auth/login').send({ email: userData.email, password: userData.password });
      const result = await request(app.getServer()).post('/auth/logout').set('Cookie', loginResult.headers['set-cookie'][0]);
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('message', 'User logged out');
      expect(result.headers['set-cookie']).toBeDefined();
    });
    it('should return 401 when not logged in', async () => {
      const result = await request(app.getServer()).post('/auth/logout');
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty('message', 'Wrong authentication token');
    });
  });

  describe('[POST] /auth/check', () => {
    it('should return user data when logged in', async () => {
      const agent = request.agent(app.getServer());

      const userData = { firstName: 'john', lastName: 'doe', email: 'john@doe.com', password: 'password123' };
      await request(app.getServer()).post('/auth/signup').send(userData);

      const loginResult = await agent.post('/auth/login').send({ email: userData.email, password: userData.password });
      expect(loginResult.status).toBe(200);

      const checkResult = await request(app.getServer()).post('/auth/check').set('Cookie', loginResult.headers['set-cookie'][0]);
      expect(checkResult.status).toBe(200);
      expect(checkResult.headers).toBeDefined();
    });

    it('should return 401 when not logged in', async () => {
      const result = await request(app.getServer()).post('/auth/check');
      expect(result.status).toBe(401);
      expect(result.body).toHaveProperty('message', 'Authentication token missing');
    });
  });
});

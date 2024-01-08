import request from 'supertest';
import { CourierService } from '@services/couriers.service';
import { App } from '../app';
import Courier from '@/models/couriers.model';
import { CourierRoute } from '@/routes/couriers.route';
import { Container } from 'typedi';
import CourierMongo from '@/database/mongo/models/Courier';
import UserMongo from '@/database/mongo/models/User';
import { migrator } from '@/database/umzug';
import User from '@/models/users.model';
import { CourierStatuses } from '@/enums/courier-statuses.enum';

jest.mock('../middlewares/auth.middleware.ts', () => ({
  AuthMiddleware: (...roles) => {
    return async (req, res, next) => {
      next();
    };
  },
}));

describe('Integration tests for courier', () => {
  let app;
  const newCourierData = { vehicle: 'car', user: { firstName: 'john', lastName: 'doe', email: 'test@courier.com', password: 'password123' } };
  beforeAll(async () => {
    Container.set(CourierService, new CourierService());
    app = new App([new CourierRoute()]);
    await app.initialize();
    await migrator.up();
  });

  afterEach(async () => {
    await Courier.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await CourierMongo.deleteMany({});
    await UserMongo.deleteMany({});
  });

  afterAll(async () => {
    await migrator.down({ to: 0 as const });
  });

  describe('GET /couriers/:id', () => {
    it('should return 404 for a non-existing courier ID', async () => {
      const res = await request(app.getServer()).get(`/couriers/1`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "Courier doesn't exist");
    });
  });

  describe('GET /couriers', () => {
    it('should return an empty array when there are no couriers', async () => {
      const res = await request(app.getServer()).get('/couriers');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
    it('should return an array with the correct couriers when there are some couriers', async () => {
      const courierData = [{ ...newCourierData }, { ...newCourierData, user: { ...newCourierData.user, email: 'test1@courier.com' } }];
      const postResponses = await Promise.all(courierData.map(data => request(app.getServer()).post('/couriers').send(data)));
      postResponses.forEach(res => expect(res.statusCode).toEqual(201));
      const res = await request(app.getServer()).get('/couriers');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
  });

  describe('POST /couriers', () => {
    it('should create a new courier', async () => {
      const newCourier = newCourierData;
      const res = await request(app.getServer()).post('/couriers').send(newCourier);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
    it('should return 409 for an existing courier', async () => {
      const newCourier = newCourierData;
      await request(app.getServer()).post('/couriers').send(newCourier);
      const res = await request(app.getServer()).post('/couriers').send(newCourier);
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', `This email ${newCourier.user.email} already exists`);
    });
    it('should return 400 for invalid courier data', async () => {
      const invalidCourier = { user: { firstName: 'john', lastName: 'doe', email: 'testcourier.com', password: 'password123' } };
      const res = await request(app.getServer()).post('/couriers').send(invalidCourier);
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('PUT /couriers/:id', () => {
    it('should return 400 for invalid update data', async () => {
      const courierId = 1;
      const invalidCourierData = { status: 'INVALID_STATUS' };
      const res = await request(app.getServer()).patch(`/couriers/${courierId}`).send(invalidCourierData);
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /couriers/:id', () => {
    it('should delete a courier', async () => {
      const newCourier = newCourierData;
      const resNewCourier = await request(app.getServer()).post('/couriers').send(newCourier);
      const res = await request(app.getServer()).delete(`/couriers/${resNewCourier.body.id}`);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 404 for a non-existing courier ID', async () => {
      const courierId = 20000000000;
      const res = await request(app.getServer()).delete(`/couriers/${courierId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "Courier doesn't exist");
    });
  });
});

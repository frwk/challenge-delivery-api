import request from 'supertest';
import { App } from '../app';
import { migrator } from '@/database/umzug';
import { DeliveryRoute } from '@/routes/deliveries.route';
import Delivery from '@/models/deliveries.model';
import { UserRoute } from '@/routes/users.route';
import { CourierRoute } from '@/routes/couriers.route';

jest.mock('../middlewares/auth.middleware.ts', () => ({
  AuthMiddleware: (...roles) => {
    return async (req, res, next) => {
      next();
    };
  },
}));

describe('Integration tests for deliveries', () => {
  let app, client, courier, deliveryData;
  const route = new DeliveryRoute().path;

  beforeAll(async () => {
    app = new App([new DeliveryRoute(), new UserRoute(), new CourierRoute()]);
    await app.initialize();
    await migrator.up();
    client = await request(app.getServer())
      .post('/users')
      .send({ firstName: 'john', lastName: 'doe', email: 'test@user.com', password: 'password123' });
    courier = await request(app.getServer())
      .post('/couriers')
      .send({ user: { firstName: 'john', lastName: 'doe', email: 'test@courier.com', password: 'password123' } });
    deliveryData = {
      pickupLongitude: '2.294481',
      pickupLatitude: '48.858370',
      dropoffLongitude: '2.352245',
      dropoffLatitude: '48.860642',
      pickupDate: new Date(),
      dropoffDate: new Date(),
      price: 10,
      courierId: courier.body.id,
      clientId: client.body.id,
      confirmationCode: '1234',
      status: 'pending',
    };
  });

  afterEach(async () => {
    await Delivery.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    await migrator.down({ to: 0 as const });
  });

  describe('GET /deliveries/:id', () => {
    it('should return a delivery', async () => {
      const resNewDelivery = await request(app.getServer()).post(route).send(deliveryData);
      expect(resNewDelivery.statusCode).toEqual(201);
      const res = await request(app.getServer()).get(`${route}/${resNewDelivery.body.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', resNewDelivery.body.id);
    });
    it('should return 404 for a non-existing delivery', async () => {
      const res = await request(app.getServer()).get(`${route}/1`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "Delivery doesn't exist");
    });
  });

  describe('GET /deliveries', () => {
    it('should return an empty array when there are no deliveries', async () => {
      const res = await request(app.getServer()).get(route);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
    it('should return an array with the correct deliveries when there are some deliveries', async () => {
      const newDeliveriesRes = [];
      for (let i = 0; i < 2; i++) {
        const res = await request(app.getServer()).post(route).send(deliveryData);
        newDeliveriesRes.push(res);
      }
      newDeliveriesRes.forEach(res => expect(res.statusCode).toEqual(201));
      const res = await request(app.getServer()).get(route);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
  });

  describe('POST /deliveries', () => {
    it('should create a new delivery', async () => {
      const res = await request(app.getServer()).post(route).send(deliveryData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
    it('should return 500 for a non-existing client ID', async () => {
      const delivery = { ...deliveryData, clientId: 10 };
      const res = await request(app.getServer()).post(route).send(delivery);
      expect(res.statusCode).toEqual(500);
    });
    it('should return 400 for invalid delivery data', async () => {
      const delivery = { ...deliveryData, pickupLongitude: 'invalid' };
      const res = await request(app.getServer()).post(route).send(delivery);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'pickupLongitude must be a longitude string or number');
    });
  });

  describe('PUT /deliveries/:id', () => {
    it('should update a delivery', async () => {
      const resNewDelivery = await request(app.getServer()).post(route).send(deliveryData);
      const deliveryUpdateData = { pickupLongitude: '2.294481' };
      const res = await request(app.getServer()).patch(`/deliveries/${resNewDelivery.body.id}`).send(deliveryUpdateData);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 404 for a non-existing delivery ID', async () => {
      const deliveryUpdateData = { pickupLongitude: '2.294481' };
      const res = await request(app.getServer()).patch(`${route}/10`).send(deliveryUpdateData);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "Delivery doesn't exist");
    });
    it('should return 400 for invalid update data', async () => {
      const invalidDeliveryData = { status: 'invalid' };
      const res = await request(app.getServer()).patch(`/deliveries/10`).send(invalidDeliveryData);
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /deliveries/:id', () => {
    it('should delete a delivery', async () => {
      const resNewDelivery = await request(app.getServer()).post(route).send(deliveryData);
      const res = await request(app.getServer()).delete(`${route}/${resNewDelivery.body.id}`);
      expect(res.statusCode).toEqual(200);
    });
    it('should return 404 for a non-existing delivery ID', async () => {
      const res = await request(app.getServer()).delete(`${route}/10`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', "Delivery doesn't exist");
    });
  });
});

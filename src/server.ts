import 'dotenv/config';
import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { DeliveryRoute } from '@routes/deliveries.route';
import { ComplaintRoute } from '@routes/complaints.route';
import { WsRoute } from './routes/ws.route';
import { CourierRoute } from './routes/couriers.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new DeliveryRoute(), new ComplaintRoute(), new CourierRoute()], [new WsRoute()]);

app.listen();

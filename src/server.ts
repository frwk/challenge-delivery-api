import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { DeliveryRoute } from './routes/deliveries.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new DeliveryRoute()]);

app.listen();

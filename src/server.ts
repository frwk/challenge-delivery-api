import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { DeliveryRoute } from '@routes/deliveries.route';
import { ComplaintRoute } from '@routes/complaints.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new DeliveryRoute(), new ComplaintRoute()]);

app.listen();

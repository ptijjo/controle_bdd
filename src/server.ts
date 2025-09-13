import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { FormRoute } from './routes/forms.route';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new FormRoute()]);

app.listen();

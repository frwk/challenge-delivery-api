import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, MONGO_URL } from '@config';
// import { DB } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { sequelize } from './database';
import mongoose from 'mongoose';
import { config } from 'dotenv';

export class App {
  public app: express.Application;
  public expressWs: expressWs.Instance;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[], wsRoutes?: Routes[]) {
    this.app = express();
    this.expressWs = expressWs(this.app);
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeWsRoutes(wsRoutes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public async initialize() {
    await this.connectToDatabase();
  }

  public async listen() {
    await this.initialize();
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      await sequelize.authenticate();
      await mongoose.connect(MONGO_URL);
      mongoose.set('toJSON', {
        virtuals: true,
        transform: (doc, converted) => {
          delete converted._id;
        },
      });
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
      }),
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeWsRoutes(routes: Routes[]) {
    routes?.forEach(route => {
      this.expressWs.app.use('/ws', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}

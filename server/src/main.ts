import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ISession, TypeormStore } from 'connect-typeorm';
import { DataSource, Repository } from 'typeorm';
import { SessionEntity } from '@/schema/session.entity';
import { ValidationPipe } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('NestApplication', {
      logLevels: ['error', 'warn', 'log', 'debug', 'verbose'],
    }),
  });

  // Get the TypeORM data source
  const dataSource = app.get(DataSource);

  const sessionRepository = dataSource.getRepository(
    SessionEntity,
  ) as Repository<ISession>;

  // Middleware setup
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'nzpLJ1yB2vkKrfb7S07oUhPYmBrTmAC3',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        ttl() {
          return 24 * 60 * 60 * 7; // 24 hours in seconds
        },
        onError: (store: TypeormStore, error: Error) => {
          console.error('Session storage error:', error);
        }
      }).connect(sessionRepository),
      genid: () => uuidv7(),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'lax', // Add for CSRF protection
      },
      name: 'connect.sid', // Set the name of the session cookie
    }),
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SlowChat API')
    .setDescription('API documentation for SlowChat')
    .setVersion('1.0')
    .addTag('chat')
    .addBearerAuth() // Optional: if you're using JWT authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});

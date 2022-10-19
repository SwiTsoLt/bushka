import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { User, UserSchema } from './user/schemas/user.schema';
import { CrateAnnouncementValidateMiddleware } from './announcements/middlewares/createAnnouncementValidate.middleware';
import { RegistrationValidateMiddleware } from './auth/middlewares/registrationValidate.middleware';

const config = require('config');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', '../', 'booshka-client', 'dist', 'booshka'),
      exclude: ['/api*']
    }),
    MongooseModule.forRoot(config.get('MongoUri')),
    UserModule,
    AuthModule,
    AnnouncementsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RegistrationValidateMiddleware).forRoutes({ path: "api/auth/registration", method: RequestMethod.POST });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/announcement", method: RequestMethod.POST });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/announcement/:id", method: RequestMethod.DELETE });
    consumer.apply(CrateAnnouncementValidateMiddleware).forRoutes({ path: "api/announcement", method: RequestMethod.POST });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/user", method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes({ path: "api/user/favorites", method: RequestMethod.GET });
  }
}

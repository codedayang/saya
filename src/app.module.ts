import {HttpModule, Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {Pair} from "./model/Pair";

@Module({
  imports: [
      HttpModule,
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
          type: "mysql",
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DB,
          entities: [Pair],
          synchronize: true
      }),
      TypeOrmModule.forFeature([Pair]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

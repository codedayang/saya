import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {join} from "path";
import {text} from "body-parser";
import {NestExpressApplication} from "@nestjs/platform-express";
import * as fs from "fs";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const publicKeyPath = "./SSLCert/full_chain.pem";
  const privateKeyPath = "./SSLCert/private.key";
  let isHttps = false;
  let httpsOptions = {};
  if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
    Logger.log("Detected ssl cert, starting https server", "Bootstrap")
    httpsOptions = {
      key: fs.readFileSync(privateKeyPath),
      cert: fs.readFileSync(publicKeyPath)
    }
    isHttps = true;
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    httpsOptions: isHttps ? httpsOptions : undefined
  });
  app.enableCors({ origin: true, credentials: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(text({inflate: true, limit: '100kb', type: "*/*"}));
  await app.listen(3000);
}

bootstrap();

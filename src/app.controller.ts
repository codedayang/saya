import {Body, Controller, Get, HttpService, Logger, LoggerService, Param, Post, Render, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {Request, Response} from 'express';
import {PlainBody} from "./decorator/PlainBody";
import * as urljoin from "url-join"

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService) {
  }

  private readonly logger = new Logger(AppController.name);

  @Get("/:key")
  async getValue(@Param("key") key: string, @Req() req: Request, @Res() res: Response) {
    try {
      const pair = await this.appService.find(key);
      if (pair.redirectTo !== "") {
        return res.redirect(pair.redirectTo);
      }
      this.logger.log(`Get value from ${req.ip}, <${pair.key}, ${pair.value}>`)
      return res.status(200).send(pair.value + "\n");
    } catch (e) {
      return res.status(200).send("\n");
    }

  }

  // async putValue(@Param("key") key: string, @PlainBody() body: string, @Res() res: Response) {

  @Post("/:key")
  async putValue(@Param("key") key: string, @Body() value: string, @Req() req: Request, @Res() res: Response) {
    // console.log(req);
    // console.log(req.body);

    let pair = await this.appService.find(key);
    if (pair == null) pair = this.appService.emptyPair();
    try {
      await this.appService.putValue(key, value);


      res.status(200).send(`OK with <${key}, ${value}>`).end();


      this.logger.log(`Put value from ${req.ip},  <${key}, ${value}>`)

      if (pair.webhookList !== undefined) {
        const webhooks = pair.webhookList.split("***").filter(item => item !== "");
        // console.log(webhooks)
        for (let item of webhooks) {
          if (item == "") continue;
          // item = item.substr(0, 7).toLowerCase() == "http://" ? item : "http://" + item;
          try {
            this.logger.log(`Posting webhook to ${item}, <${key}>`)
            await this.httpService.post(item, {
              msg: "Changed",
              key: key,
              oldValue: pair.value,
              newValue: value
            }).toPromise();

          } catch (e) {
            this.logger.log(`webhook链接无效: ${e.config.url}`);
          }

        }
      }

    } catch (e) {
      console.log(e);
      res.status(500).send("ERROR");
    }
  }

  @Get("/:key/ui")
  @Render("editor")
  async getUi(@Param("key") key: string, @Req() req: Request): Promise<any> {
    const pair = await this.appService.find(key);
    this.logger.log(`Get ui from ${req.ip},  <${pair.key}, ${pair.value}>`)
    return {
      key: key,
      value: pair.value
    };
  }

  @Post("/:key/setRedirect")
  async setRedirect(@Param("key") key: string, @Body() value: string, @Req() req: Request, @Res() res: Response) {
    try {
      await this.appService.setRedirect(key, value);
      this.logger.log(`Set redirect from ${req.ip}, ${key}, ${value}`)
      res.status(200).send("OK");
    } catch (e) {
      console.log(e);
      res.status(500).send("ERROR");
    }
  }

  @Post("/:key/addWebhook")
  async addWebhook(@Param("key") key: string, @Body() value: string, @Req() req: Request, @Res() res: Response) {
    try {
      await this.appService.addWebhook(key, value);
      this.logger.log(`Add webhook from ${req.ip}, ${key}, ${value}`)
      res.status(200).send("OK");
    } catch (e) {
      console.log(e);
      res.status(500).send("ERROR");
    }
  }
}

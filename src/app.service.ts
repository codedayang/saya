import { Injectable } from '@nestjs/common';
import {Pair} from "./model/Pair";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(Pair) private pairRepository: Repository<Pair>
  ) {}

  emptyPair(): Pair {
    return this.pairRepository.create();
  }
  async getValue(key: string): Promise<string> {
    const pair = await this.find(key);
    if (pair == null) {
      return ""
    } else {
      return pair.value;
    }
  }

  async putValue(key: string, newValue: string): Promise<boolean> {
    const pair = await this.find(key);
    if (pair == null) {
      await this.pairRepository.save({
        key: key,
        value: newValue
      })
    } else {
      pair.value = newValue;
      await this.pairRepository.save(pair)
    }
    return true;
  }

  async setRedirect(key: string, url: string) {
    const pair = await this.find(key);
    if (pair == null) {
      await this.pairRepository.save({
        key: key,
        redirectTo: url
      })
    } else {
      pair.redirectTo = url;
      await this.pairRepository.save(pair)
    }
  }

  async addWebhook(key: string, url: string) {
    const pair = await this.find(key);
    if (pair == null) {
      await this.pairRepository.save({
        key: key,
        webhookList: url
      })
    } else {
      pair.webhookList += `***${url}`;
      await this.pairRepository.save(pair)
    }
  }

  async find(key: string): Promise<Pair> {
    const item = await this.pairRepository.findOne({
      where: {
        key: key
      }
    })
    if (item == null) {
      return null;
    } else {
      return item;
    }
  }
}

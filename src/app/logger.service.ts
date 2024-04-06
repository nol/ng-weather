import { Injectable } from "@angular/core";

@Injectable()
export class LoggerService {
  debug(...args: any[]): void {
    console.debug(...args);
  }
  info(...args: any[]): void {
    console.info(...args);
  }
  warn(...args: any[]): void {
    console.warn(...args);
  }
  error(...args: any[]): void {
    console.error(...args);
  }
}
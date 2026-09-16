import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";


export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    console.log("Before handling request:");
    return next.handle().pipe(
      map((dataFromRouteHandler) => {
        const { password, ...otherData } = dataFromRouteHandler;
        return {...otherData};
      })
    );
  }
}

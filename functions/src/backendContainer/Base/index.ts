import { Container } from 'inversify';
import { BaseService } from './BaseService';
import { SDKService } from './SDKService';
const baseServiceContainer = new Container();

baseServiceContainer.bind<BaseService>(BaseService).toSelf().inSingletonScope();
baseServiceContainer.bind<SDKService>(SDKService).toSelf().inSingletonScope();

export { baseServiceContainer, BaseService };

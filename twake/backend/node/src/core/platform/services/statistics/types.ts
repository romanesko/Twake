import { TwakeServiceProvider } from "../../framework";

export interface StatisticsAPI extends TwakeServiceProvider {
  increase(companyId: string, eventName: string): Promise<unknown>;
  get(companyId: string | null, eventName: string): Promise<number>;
}

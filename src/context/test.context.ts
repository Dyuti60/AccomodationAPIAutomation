import { AxiosResponse } from "axios";

export const TestContext = {
  authToken: '' as string,
  stateToken: '' as string,
  lastResponse: null as AxiosResponse | null
};

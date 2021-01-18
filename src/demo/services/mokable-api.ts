import Axios, { AxiosInstance } from "axios";
import { MinMax } from "../../misc/models/MinMax";

class MockableService {
  api: AxiosInstance;

  constructor() {
    this.api = Axios.create({
      baseURL: "https://demo5808070.mockable.io/",
    });
  }

  getExercise1Options() {
    return this.api.get<MinMax>("/min-max");
  }

  getExercise2Options() {
    return this.api.get<number[]>("/values");
  }
}

const MockableApi = () => {
  return new MockableService();
};

export default MockableApi();

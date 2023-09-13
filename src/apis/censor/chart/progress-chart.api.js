import { request } from "../../../helper/request.helper";

export class ChartAPI {

    static COMPONENT_NAME = "censor/chart";

    static getPrChart = (filter) => {
      return request({
        method: "GET",
        url: `/${this.COMPONENT_NAME}`,
        params: filter
      });
    };
}
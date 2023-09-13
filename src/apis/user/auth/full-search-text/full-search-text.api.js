import { request } from "../../../../helper/request.helper";

export class FullSearchTextAPI {
  static COMPONENT_NAME = "full-text-search";

  static getSearchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };
}

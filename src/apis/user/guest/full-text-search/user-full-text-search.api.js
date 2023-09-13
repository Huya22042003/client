import { request } from "../../../../helper/request.helper";

export class FullTextSearchAPI {
  static COMPONENT_NAME = "full-text-search";

  static getAllSearch = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };
}

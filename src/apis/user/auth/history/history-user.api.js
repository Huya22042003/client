import { request } from "../../../../helper/request.helper";


export class UserHistoryAPI {
  static COMPONENT_NAME = "history";

  static fetchAllHistory = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };
}

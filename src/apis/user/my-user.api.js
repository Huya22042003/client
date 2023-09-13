import { request } from "../../helper/request.helper";

export class UserAPI {
  static COMPONENT_NAME = "user";

  static findByUserId = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/my-user-detail`,
    });
  };
}

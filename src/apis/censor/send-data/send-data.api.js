import { request } from "../../../helper/request.helper";

export class CensorSendDataApi {
  static COMPONENT_NAME = "censor/send-data";

  static ferchUrlForm = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };
  static ferchUrlFormAll = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/get-all`,
    });
  };
}

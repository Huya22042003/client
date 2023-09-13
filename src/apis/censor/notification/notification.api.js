import { request } from "../../../helper/request.helper";

export class NotificationAPI {
  static COMPONENT_NAME = "censor/notification";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static fetchCountNotification = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/count`,
    });
  };

  static markAllAsRead = () => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-all-status`,
    });
  };
}

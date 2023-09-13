import { request } from "../../../../helper/request.helper";

export class NotificationAPI {
  static COMPONENT_NAME = "notification";

  static fetchNotification = (filter) => {
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

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-notification/${id}`,
    });
  };

  static markAllAsRead = () => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-all-status`,
    });
  };
}

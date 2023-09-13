import { request } from "../../../helper/request.helper";

export class TeacherAPI {
  static COMPONENT_NAME = "censor/teacher";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static detail = (data, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/${id}`,
      data: data,
    });
  };

  static page = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/page`,
      params: filter,
    });
  };
}

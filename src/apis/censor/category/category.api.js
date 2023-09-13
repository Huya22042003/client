import { request } from "../../../helper/request.helper";

export class CategoryAPI {
  static COMPONENT_NAME = "censor/category";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/crud`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/add-category`,
      data: data,
    });
  };

  static update = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-category/${id}`,
      data: data,
    });
  };

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-category/${id}`,
    });
  };

  static detail = (data, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/get-one/${id}`,
      data: data,
    });
  };
  static fetchAllCategory = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/list-category`,
      params: filter,
    });
  };
}

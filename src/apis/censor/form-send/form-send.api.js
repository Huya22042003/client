import { request } from "../../../helper/request.helper";

export class FormSendAPI {
  static COMPONENT_NAME = "censor/form-send";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/add`,
      data: data,
    });
  };

  static update = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update/${id}`,
      data: data,
    });
  };

  static delete = (id) => {
    return request({
      method: "PATCH",
      url: `/${this.COMPONENT_NAME}/delete/${id}`,
    });
  };

  static detail = (data, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/get-one/${id}`,
      data: data,
    });
  };

  static setDefault = (id) => {
    return request({
      method: "PATCH",
      url: `/${this.COMPONENT_NAME}/set-default/${id}`,
    });
  };
  static unSetDefault = (id) => {
    return request({
      method: "PATCH",
      url: `/${this.COMPONENT_NAME}/unset-default/${id}`,
    });
  };
}

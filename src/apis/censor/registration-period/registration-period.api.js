import { request } from "../../../helper/request.helper";

export class CensorRegistrationPeriodAPI {
  static COMPONENT_NAME = "censor/registration-period";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static getAll = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/all`,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}`,
      data: data,
    });
  };

  static update = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/${id}`,
      data: data,
    });
  };

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete/${id}`,
    });
  };

  static detail = (data, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/${id}`,
      data: data,
    });
  };

  static downloadExcel_xlsx = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/download/xlsx`,
      responseType: "arraybuffer",
    });
  };

  static importExcel = (formdata) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/upload-excel`,
      data: formdata,
    });
  };
  
  static close = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/close/${id}`,
      data: data,
    });
  };
}

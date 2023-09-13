import { request } from "../../../helper/request.helper";

export class CensorRegistrationUserAPI {
  static COMPONENT_NAME = "censor/user-registration";

  static fetchAll = (filter, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/${id}`,
      params: filter,
    });
  };

  static fetchUserNotInRes = (data, id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/view-user/${id}`,
      params: data,
    });
  };

  static delete = (data, id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-user-Registration?idDot=${id}`,
      data: data,
    });
  };

  static update = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-user-Registration?idDot=${id}`,
      data: data,
    });
  };

  static addListUserInListRegistration = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/add-list-user-in-list-registration`,
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
}

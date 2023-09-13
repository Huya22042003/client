import { request } from "../../../helper/request.helper";

export class DownloadArticleAPI {
  static COMPONENT_NAME = "censor/download";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static export = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}`,
      data: data,
      responseType: "arraybuffer", // Xử lý dữ liệu nhị phân
    });
  };

  static fetchAllRegistration = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/registration`,
    });
  };
  
  static fetchLoadCbb = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/load-combobox`,
    });
  };

  static updateStatus = (data, status) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/update-status`,
      params: status,
      data: data
    });
  };
}

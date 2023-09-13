import { request } from "../../../helper/request.helper";

export class CensorAPI {
  static COMPONENT_NAME = "censor/article";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static approveArticle = (data) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/approve-article`,
      data: data,
    });
  };

  static refuseArticle = (data) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/refuse-article`,
      data: data,
    });
  };

  static detail = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/${id}`,
    });
  };

  static detailApprovedArticle = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/approved/${id}`,
    });
  };

  static fetchAllApprovedArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/approved`,
      params: filter,
    });
  };

  static fetchAllSentArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/sent-article`,
      params: filter,
    });
  };

  static countApprovedArticle = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/count-approved-article`,
    });
  };

  static getAllHistoryArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/history`,
      params: filter,
    });
  };
}

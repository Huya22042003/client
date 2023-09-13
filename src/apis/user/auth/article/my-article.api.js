import { request } from "../../../../helper/request.helper";

export class MyArticleAPI {
  static COMPONENT_NAME = "my-article";

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static findMyArticleByStatus = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/status`,
      params: filter,
    });
  };

  static createArticleToCensor = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create-article`,
      data: data,
    });
  };

  static createDraftArticle = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create-draft-article`,
      data: data,
    });
  };

  static updateDraftArticle = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-article/${id}`,
      data: data,
    });
  };

  static updateArticleTCensor = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/update-article-to-censor/${id}`,
      data: data,
    });
  };

  static detailMyArticle = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-update-my-article/${id}`,
    });
  };

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-article-to-trash/${id}`,
    });
  };

  static getFileHtml = (url) => {
    return request({
      method: "GET",
      url: url,
    });
  };

  static fetchRegistraition = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/find-registration-period`,
    });
  };
}

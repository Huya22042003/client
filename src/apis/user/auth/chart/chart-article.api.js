import { request } from "../../../../helper/request.helper";

export class CharArticleAPI {
  static COMPONENT_NAME = "chart";

  static getAllArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/status`,
      params: filter,
    });
  };

  static getNumberArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/number-article`,
      params: filter,
    });
  };

  static getArticleByDate = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/article`,
      // params: filter,
    });
  };

  static findAllArticleBrowseDate = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/browse-date-article`,
      params: filter,
    });
  };
}

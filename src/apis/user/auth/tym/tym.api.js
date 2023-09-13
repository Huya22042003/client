import { request } from "../../../../helper/request.helper";

export class TymAPI {
  static COMPONENT_NAME = "tym";

  static createTymArticle = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/favorite-article`,
      data: data,
    });
  };
  static deleteTymArticle = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/unfavorite-article/${id}`,
    });
  };
  static getAllTymArticle = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/all-favorite-article`,
    });
  };
  static deleteAllTymArticle = (ids) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/${ids}`,
    });
  };
}

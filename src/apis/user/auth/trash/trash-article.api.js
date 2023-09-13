import { request } from "../../../../helper/request.helper";

export class ArticleTrashAPI {
  static COMPONENT_NAME = "article-trash";

  static fetchAllArticleTrash = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static restore = (id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/restore/${id}`,
    });
  };

  static deleteTrash = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/${id}`,
    });
  };
}

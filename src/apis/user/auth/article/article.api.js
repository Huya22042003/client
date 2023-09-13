import { request } from "../../../../helper/request.helper";

export class ArticleAPI {
  static COMPONENT_NAME = "article";

  static fetchAllArticle = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
      params: filter,
    });
  };

  static fetchAllArticleByBrowseDate = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/by-browse-date`,
      params: filter,
    });
  };

  static fetchAllArticleByTym = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/by-tym`,
      params: filter,
    });
  };

  static detailArticle = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/${id}`,
    });
  };

  static fetchAllArticleByAuthor = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/author`,
      params: filter,
    });
  };

  static fetchAllArticleByCategory = (filter) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/find-article-name-category`,
      params: filter,
    });
  };
  static getPostsPage = async (pageParam = 1, options = {}) => {
    const response = await request.get(`/article?page=${pageParam}`, options);
    return response.data.data.data;
  };
}

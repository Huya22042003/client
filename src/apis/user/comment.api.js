import { request } from "../../helper/request.helper";

export class CommentAPI {
  static COMPONENT_NAME = "comment";

  static findCommentByArticleId = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-comment-article/${id}`,
    });
  };
}

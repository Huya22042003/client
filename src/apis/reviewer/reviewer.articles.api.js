import { request } from "../../helper/request.helper";

export class ReivewerArticleAPI {
    static COMPONENT_NAME = "reviewer/article";

    static fetchAllArticle = (page) => {
        return request({
            method: "GET",
            url: `/${this.COMPONENT_NAME}`,
            params: { page }
        });
    }

    static fetchAllArticleSearch = (filter) => {
        return request({
            method: "GET",
            url: `/${this.COMPONENT_NAME}`,
            params: filter
        });
    }

    static fetchArticleById = (articleId) => {
        return request({
            method: "GET",
            url: `/${this.COMPONENT_NAME}/${articleId}`
        });
    }

    static evaluateArticle = (data) => {
        return request({
            method: "POST",
            url: `/${this.COMPONENT_NAME}/evaluate`,
            data: data
        });
    }
}
import { request } from "../../../../helper/request.helper";

export class UserAlbumAPI {
  static COMPONENT_NAME = "album";

  static findAllAlbumByUserId = () => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}`,
    });
  };

  static findAllSimpleAllBumByUserId = (id) => {
    return request({
      method: "GET",
      url: `/${this.COMPONENT_NAME}/detail-album-user/${id}`,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/add-article`,
      data: data,
    });
  };

  static delete = (filter) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/delete-all-article`,
      params: filter,
    });
  };

  static createAlbum = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}/create`,
      data: data,
    });
  };
}

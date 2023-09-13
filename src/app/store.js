import { configureStore } from "@reduxjs/toolkit";
import albumReducer from "./reducers/album/album.reducer";
import articlesReducer from "./reducers/articles/articles.reducer";
import articlesAlbumReducer from "./reducers/articles-album/articles-album.reducer";
import articlesHashTagReducer from "./reducers/articles-hashtag/articles-hashtag.reducer";
import categoryReducer from "./reducers/category/category.reducer";
import commentsReducer from "./reducers/comments/comments.reducer";
import evaluateReducer from "./reducers/evaluate/evaluate.reducer";
import hashtagReducer from "./reducers/hashtag/hashtag.reducer";
import historyReducer from "./reducers/history/history.reducer";
import notificationReducer from "./reducers/notification/notification.reducer";
import pointReducer from "./reducers/point/point.reducer";
import tymsReducer from "./reducers/tyms/tyms.reducer";
import usersReducer from "./reducers/users/users.reducer";
import registrationPeriodReducer from "./reducers/registration-period/registration-period.reducer";
import registrationUserReducer from "./reducers/registration-user/registration-user.reducer";
import loaddingReducer from "./reducers/loading/loading.reducer";
import countNotificationReducer from "./reducers/notification/count-notification.reducer";
import formSendReducer from "./reducers/form-send/form-send.reducer";

export const store = configureStore({
  reducer: {
    album: albumReducer,
    articles: articlesReducer,
    articlesAlbum: articlesAlbumReducer,
    articlesHashTag: articlesHashTagReducer,
    category: categoryReducer,
    comments: commentsReducer,
    evaluate: evaluateReducer,
    hashtag: hashtagReducer,
    history: historyReducer,
    notification: notificationReducer,
    point: pointReducer,
    tyms: tymsReducer,
    user: usersReducer,
    registrationPeriod: registrationPeriodReducer,
    registrationUser: registrationUserReducer,
    loadding: loaddingReducer,
    countNotification: countNotificationReducer,
    formSend: formSendReducer,
  },
});

export const dispatch = store.dispatch;
export const getState = store.getState;

import { Button, Card } from "antd";
import React, { useEffect } from "react";
import ResultUser from "./ResultUser";
import { FullSearchTextAPI } from "../../../apis/user/auth/full-search-text/full-search-text.api.js";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
import CardDemo from "../card/ViewCard";

const AllFullTS = (props) => {
  const dispatch = useAppDispatch();

  const articles = useAppSelector(GetArticles);
  const user = useAppSelector(GetUser);
  const { search } = props
  useEffect(() => {
    fetchFullSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchFullSearch = () => {
    FullSearchTextAPI.getSearchAll({ page: 0, search: search }).then((response) => {
      let user = []
      let articles = []
      response.data.data.forEach((element) => {
        if (element.classify === 1) {
          articles.push(element);
        } else if (element.classify === 2) {
          user.push(element);
        }
      });
      dispatch(SetUser(user));
      dispatch(SetArticles(articles));
    });
  };

  return (
    <div>
      { user.length !== 0  && <Card className="mb-5">
        <div className="-mt-4">
          <p className="text-xl">Mọi người</p>
          <ResultUser data={user}></ResultUser>
          <Button
            type="primary"
            block
            className=" mt-3"
            style={{ fontSize: "15px", backgroundColor: "#2e2e2e" }}
          >
            Xem tất cả
          </Button>
        </div>
      </Card>}
      {articles.length !== 0 && <div>
        
      <span style={{marginBottom: "40px"}}
                className="fancy justify-center items-center flex text-center">
        <hr className="w-full bg-gray-200 border-0" />
                 <span
                  className="text w-full"
                  style={{
                    color: "gray",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  DANH SÁCH BÀI VIẾT TÌM KIẾM
                </span>
                <hr className="w-full bg-gray-200 border-0" />
      </span>
                
        <CardDemo data={articles}></CardDemo>
        
        <Button
            type="primary"
            block
            className=" mt-3"
            style={{ fontSize: "15px", backgroundColor: "#2e2e2e" }}
          >
            Xem tất cả
          </Button>
      </div>}
      
    </div>
  );
};

export default AllFullTS;

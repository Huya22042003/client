import React from "react";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardDetailMyArticles from "./CardDetailMyArticle";

const DetailMyArticle = () => {
  const [detailMyArticle, setDetailMyArticle] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
      try {
        const response = await MyArticleAPI.detailMyArticle(id);
        setDetailMyArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchDetailArticles();
  }, [id]);

  return (
    <div>
      <CardDetailMyArticles data={detailMyArticle} />
    </div>
  );
};

export default DetailMyArticle;

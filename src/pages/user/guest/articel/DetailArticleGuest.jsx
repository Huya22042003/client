import React from "react";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardArticlesGuest from "./CardDetailGuest";

const DetailArticleGuest = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchDetailArticles = async () => {
      try {
        const response = await ArticleAPI.detailArticle(id);
        setDetailArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchDetailArticles();
  }, [id]);

  return (
    <div>
      <CardArticlesGuest data={detailArticle} />
    </div>
  );
};

export default DetailArticleGuest;

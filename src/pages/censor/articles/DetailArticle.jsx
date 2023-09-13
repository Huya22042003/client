import React from "react";
import anh1 from "../../../assets/images/face-1.jpg";
import { Avatar, Col, Row, Typography } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import { useParams, useNavigate } from "react-router-dom";

const DetailArticle = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchDetailArticles = async () => {
      try {
        const response = await CensorAPI.detailApprovedArticle(id);
        setDetailArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchDetailArticles();
  }, []);

  return (
    <>
      <div className="justify-items-center bg-white -mt-2 rounded-md">
        {/* open model */}
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* detail bài viết */}
          <Row>
            <Col span={24}>
              <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8">
                {detailArticle.title}
              </h1>
              <div className="flex">
                <Avatar src={anh1} style={{ width: "50px", height: "50px" }} />

                <div className="ml-3">
                  <div className="flex">
                    <Typography variant="subtitle1" className="name1">
                      {detailArticle.name}
                    </Typography>
                  </div>
                  <span>
                    {moment(detailArticle.createdDate).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              <div>
                <JoditEditor
                  value={detailArticle.content}
                  tabIndex={-1}
                  className="bg-transparent"
                  config={{
                    readonly: true,
                    toolbar: false,
                    showCharsCounter: false,
                    showWordsCounter: false,
                    showStatusbar: true,
                    showPoweredBy: false,
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default DetailArticle;

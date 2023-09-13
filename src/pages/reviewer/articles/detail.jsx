import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./detail.css"
import { Rate, Button, Tag, Space, Row, Col, Avatar, Typography} from "antd";
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import { ReivewerArticleAPI } from '../../../apis/reviewer/reviewer.articles.api';
import JoditEditor from 'jodit-react';
import { message } from 'antd';


export default function DetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [content, setContent] = useState("");
  const [star, setStar] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    ReivewerArticleAPI.fetchArticleById(id).then((response) => {
      setArticle(response.data.data)
      console.log(response.data.data);
    })
  }, [id]);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const evaluate = async () => {
    if (content.trim() === '') {
      message.error('Vui lòng nhập đánh giá trước khi gửi.');
      return;
    }

    try {
      await ReivewerArticleAPI.evaluateArticle({
        articlesId: id,
        content: content,
        star: star,
      });
      message.success('Thành công!');
      navigate('/reviewer/article');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="justify-items-center">
      <Row>
        <Col span={24}>
          <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8 ">
            {article.title}
          </h1>
          <div className="flex">
            <Avatar src={article.img} style={{ width: "48px", height: "48px" }} />

            <div className="ml-3 mt-1">
              <div className="flex">
                <Typography variant="subtitle1">{article.name}</Typography>
                <span className="text-3xl text-slate-900 font-normal ml-1 -mt-4 ">
                  .
                </span>

                <span className="ml-1 text-green-900">
                  <a href="#">Follow</a>
                </span>
              </div>
              <span>{formatDate(article.createdDate)}</span>
            </div>
          </div>
          <div
            className="flex mt-8 -ml-3.5 py-3 px-1 justify-between"
            style={{
              borderBottom: "1px solid rgba(242, 242, 242, 1)",
              borderTop: "1px solid rgba(242, 242, 242, 1)",
            }}
          >
          </div>
          <div>
            <JoditEditor
              value={article.descriptive}
              tabIndex={-1}
              className="view_editor_jodit"
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
          <Row>
            <div className=" float-left pt-5 pb-10">
              <Space size={[0, 8]} wrap>
                {article.hashtags == null ? (
                  ""
                ) : (
                  article.hashtags.split(',').map((tag) => <Tag color="blue">{tag.trim()}</Tag>)
                )}
              </Space>
            </div>
          </Row>
          <div className='detail'>
                <Rate
                  value={star}
                  onChange={value => setStar(value)}
                  name="star"
                  className='rate'
                />
                <TextArea value={content}
                  placeholder="Đánh giá bài viết"
                  onChange={e => setContent(e.target.value)}
                />
                <Button type="primary" className="btnDanhGia" onClick={() => evaluate()}>Đánh giá</Button>
              </div>
        </Col>
      </Row>
    </div>
  );
}
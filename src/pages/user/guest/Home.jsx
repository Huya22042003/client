import { Col, Image, Row } from "antd";
import Link from "antd/es/typography/Link";
import React from "react";
import CardHome from "./CardHome";
import "./index.css";
import { ArticleAPI } from "../../../apis/user/auth/article/article.api";
import { useState, useRef, useEffect } from "react";
const HomeGuestUser = () => {
  const [articlesByBrowseDate, setArticlesByBrowseDate] = useState([]);
  const [articlesByTym, setArticlesByTym] = useState([]);

  useEffect(() => {
    const fetchArticlesByBrowseDate = async () => {
      try {
        const response = await ArticleAPI.fetchAllArticleByBrowseDate();
        setArticlesByBrowseDate(response.data.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    const fetchArticlesByTym = async () => {
      try {
        const response = await ArticleAPI.fetchAllArticleByTym();
        setArticlesByTym(response.data.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticlesByBrowseDate();
    fetchArticlesByTym();
  }, []);
  return (
    <>
      <div
        className="m-auto px-20 scroll-smooth home-guest"
        style={{ paddingTop: "150px", background: "#fff" }}
      >
        <Row>
          <Col xl={15} lg={14} md={24} className=" px-5">
            <Image
              className="rounded-md"
              src="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b48e5a3c57559360cd83d24_image-15.jpg"
            />
          </Col>
          <Col xl={9} lg={10} md={24} className="flex-1 max-w-max">
            <div className="p-10">
              <Link href="home" style={{ color: "gray", fontWeight: 500 }}>
                BÀI VIẾT NỔI BẬT
              </Link>
              <Link href="home">
                <h1
                  className="tracking-wider mt-2"
                  style={{ fontWeight: "900" }}
                >
                  JAPAN HOUSE OPENS IN MOUNTAINSID TO FOSTER PEAK CREATIVITY
                </h1>
                <p className="text-gray-500 text-justify tracking-wider">
                  Enim omittam qui id, ex quo atqui dictas complectitur. Nec ad
                  timeam accusata, hinc justo falli id eum, ferri novum molestie
                  eos cu.
                </p>
              </Link>
              <Link href="home" className="mr-2">
                #hashtag
              </Link>
              <Link href="home" className="mr-2">
                #hashtag
              </Link>
              <Link href="home" className="mr-2">
                #hashtag
              </Link>
              <Link href="home" className="mr-2">
                #hashtag
              </Link>
              <div id="container">
                <button class="learn-more">
                  <span class="circle" aria-hidden="true">
                    <span class="icon arrow"></span>
                  </span>
                  <span class="button-text">XEM THÊM</span>
                </button>
              </div>
            </div>
          </Col>
        </Row>
        {/* <div className="pt-10">
            <Row className="justify-between">
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="1"
                  idBaiViet="1"
                  image="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b48e443b9f372cb2a21aea7_image-13.jpg"
                  avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  title="HELMUT LANG CELEBRATES TAXI DRIVERS WORLDWIDE IN LATEST CAMPAIGN"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="1"
                  idBaiViet="1"
                  image="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b48e3a5c575599d9ad83c1b_image-12.jpg"
                  avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  title="HELMUT LANG CELEBRATES TAXI DRIVERS WORLDWIDE IN LATEST CAMPAIGN"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="2"
                  idBaiViet="1"
                  image="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b48e3149918eadd57ae153d_image-11.jpg"
                  avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  title="BOWLCUT LAUNCH A NEW SUMMER COLLECTION THAT PAYS HOMAGE TO “UK LEGENDS”"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
            </Row>

            <Row className="justify-between">
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="4"
                  idBaiViet="1"
                  image="https://scontent-hkg4-1.xx.fbcdn.net/v/t39.30808-6/355896356_650082410481924_6462634096144912567_n.jpg?stp=cp6_dst-jpg&_nc_cat=1&cb=99be929b-3346023f&ccb=1-7&_nc_sid=730e14&_nc_ohc=n64zxHB1KEoAX-PHdaB&_nc_ht=scontent-hkg4-1.xx&oh=00_AfCItMFOpzPS0NeXZQzrxKtFs-arQzP7XQu6SJuiB_n7yg&oe=64A16071"
                  avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  title="LONDON-BASED YINKA ILORI’S STORYTELLING FURNITURE"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="5"
                  idBaiViet="1"
                  image="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b48d4b28d2f84340af39762_image-9.jpg"
                  avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  title="ANONYMOUS ISRAELI ART COLLECTIVE BROKEN FINGAZ DIRECT MUSIC VIDEO FOR U2 AND BECK"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
              <Col className="mt-5" lg={7} sm={24}>
                <CardHome
                  key="6"
                  idBaiViet="1"
                  image="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b8025848e9ed86d1095b95f_article-image.jpg"
                  avatar="https://assets.website-files.com/5b47286ba09814724c5a5ff4/5b8025848e9ed86d1095b95f_article-image.jpg"
                  title="SUZANNE SAROFF’S METICULOUSLY ARRANGED PHOTOGRAPHS ALTER PERCEPTIONS"
                  category={{ id: "1", name: "code sạch" }}
                  subTitle="Ea iudico labore deserunt mei, pro ad dicant forensibus dissentiunt, mel id hendrerit incorrupte. Viris laudem malorum an eum, cu quo elit albucius corrumpit. Inani mollis pericula an nec. Modo brute liber ea qui, aeque cetero duo ei."
                />
              </Col>
            </Row>
          </div> */}
        {/* view theo bài viết mới nhất */}
        <hr className="mt-16 mb-8 bg-gray-200 border-0" />
        <div>
          <Link href="home" style={{ color: "gray", fontWeight: 500 }}>
            BÀI VIẾT MỚI NHẤT
          </Link>
          <div>
            <Row className="justify-between">
              {articlesByBrowseDate.map((article) => (
                <Col key={article.id} className="mt-5" lg={11} xl={5} sm={24}>
                  <CardHome
                    idBaiViet={article.id}
                    image={article.urlImage}
                    avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                    title={article.title}
                    category={{ id: "1", name: article.nameCategory }}
                    subTitle={article.descriptive}
                  />
                </Col>
              ))}
            </Row>
            <Row className="mt-14 flex justify-center">
              <Col span={24} className="text-center">
                <Link className="fancy" href={`/articel?category=${"1"}`}>
                  <span className="top-key"></span>
                  <span className="text">XEM TẤT CẢ</span>
                  <span className="bottom-key-1"></span>
                  <span className="bottom-key-2"></span>
                </Link>
              </Col>
            </Row>
          </div>
        </div>
        {/* view theo bài viết được yêu thích nhiều nhất */}
        <hr className="mt-16 mb-8 bg-gray-200 border-0" />
        <div>
          <Link href="home" style={{ color: "gray", fontWeight: 500 }}>
            BÀI VIẾT YÊU THÍCH NHẤT
          </Link>
          <div>
            <Row className="justify-between">
              {articlesByTym.map((article) => (
                <Col key={article.id} className="mt-5" lg={11} xl={5} sm={24}>
                  <CardHome
                    idBaiViet={article.id}
                    image={article.urlImage}
                    avatar="https://xsgames.co/randomusers/avatar.php?g=pixel"
                    title={article.title}
                    category={{ id: "1", name: article.nameCategory }}
                    subTitle={article.descriptive}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        <hr className="mt-16 mb-8 bg-gray-200 border-0" />
        <div>
          <div className="content">
            <div className="wrapper-1">
              <div className="wrapper-2">
                <h1 className="thank-you">Thank you !</h1>
                <p>Thanks for subscribing to our news letter. </p>
                <p>you should receive a confirmation email soon </p>
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth", // Bật hiệu ứng cuộn mượt
                    });
                  }}
                  className="go-home"
                >
                  go home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeGuestUser;

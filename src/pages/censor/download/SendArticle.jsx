import { useEffect, useState } from "react";
import { CensorSendDataApi } from "../../../apis/censor/send-data/send-data.api";
import { Button, Card, Col, Modal, Row, Tooltip } from "antd";
import { FileAddOutlined, SendOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import ModalThem from "../form-send/ModalAdd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetFormSend, SetFormSend } from "../../../app/reducers/form-send/form-send.reducer";

/* eslint-disable jsx-a11y/iframe-has-title */
const SendArticle = () => {
  const [urlForm, setUrlForm] = useState({});
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    CensorSendDataApi.ferchUrlForm().then((response) => {
      setUrlForm(response.data.data);
    })
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const fetchData = () => {
    CensorSendDataApi.ferchUrlFormAll().then((response) => {
      dispatch(SetFormSend(response.data.data));
    });
  };

  const data = useAppSelector(GetFormSend);
  const openModalFormSend = (url, title) => {
    if (url) {
      Modal.confirm({
        title: <span><h3 className="m-0 font-semibold">{title}</h3></span> ,
        icon: null, 
        content: (
          <>
            <hr className="border-0 bg-gray-300 mt-3 mb-6" />
            <div style={ { maxWidth: '100%' }}>
              <iframe width={"100%"} className="border-0" height={windowHeight - 200} src={`${url}?embedded=true`} />
            </div>
          </>
        ),
      width: '70%',
        maskClosable: true,
        style: { top: '50%', transform: 'translateY(-50%)', maxWidth: '100%' },
      closable: true, 
      okText: "Chọn form khác",
      cancelText: "Đóng",
        onOk: () => {
          openModal();
        }
      });
    } else {
      openModal()
    }
   
  }

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const openModal = () => {
    setIsModalVisible(true);
  };

  const backgrounds = [
    'rgb(103, 58, 183)',
    'rgb(169 58 58);', 
    'rgb(31 131 25)', 
    'rgb(25 67 131)',
    'rgb(180 159 7)',
    'rgb(148 26 120)',
    'rgb(148 26 133)',
    'rgb(26 146 148)'
  ];
  
  // Hàm để chọn ngẫu nhiên một phần tử từ mảng backgrounds
  function getRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
  }

  return (
    <>
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          category={null}
          SetCategory={null}
          isSendArticle = {true}
        />
      )}
    <Tooltip title="Chọn form gửi">
        <Button type="primary" onClick={() => {
          if (urlForm) {
            openModalFormSend(urlForm.url, urlForm.title)
          } else {
            openModal();
          }
        }}>
                  <SendOutlined />Gửi form</Button>
      </Tooltip>
      <Modal
        title={<span><h3 className="m-0 font-semibold">Danh sách Form
          <Tooltip title="Thêm form mới">
            <Button shape="circle ml-6" style={{ width: "40px" }}
            onClick={() => {
              setShowModal(true);
            }}  icon={<FileAddOutlined />} />
          </Tooltip></h3></span>} 
        icon={null} 
        width={'80%'}
        maskClosable={true}
        style= {{ top: '50%', transform: 'translateY(-50%)', maxWidth: '100%' }}
        closable={true}
        okText="Đóng"
        cancelButtonProps= {{ style: { display: 'none' } }}
        visible={isModalVisible}
        onOk={() => {
          closeModal();
        }} 
        onCancel={() => {
          closeModal();
        }}
      >
      <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <Row>
        {data.map((item) => (
          <Col xl={6} lg={8} md={12} sm={24} key={item.id}>
            <Card
              hoverable
              style={{
                width: 240,
                marginTop: 15,
              }}
              onClick={() => {
                closeModal();
                openModalFormSend(item.url, item.title);
              }}
            >
              <div
                className="JH79cc RVEQke b33AEc"
                style={{ backgroundColor: getRandomBackground() }}
              ></div>
              <Meta title={item.title} description={item.url} />
            </Card>
          </Col>
        ))}
      </Row>
      </Modal>
    </>
  );
};

export default SendArticle;

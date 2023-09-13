import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
  Avatar,
  Input,
  List,
  Menu,
} from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  BellFilled,
  ClockCircleFilled,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import avtar from '../../../assets/images/team-2.jpg';
import tym from '../../../assets/images/38064371 (2).jpg';
import comment from '../../../assets/images/38064371 (3).jpg';
import approved from '../../../assets/images/check.png';
import refuse from '../../../assets/images/cancel.png';
import evaluate from '../../../assets/images/star.png';
import { NotificationAPI } from '../../../apis/user/auth/notification/notification.api';
import {
  GetNotification,
  SetNotification,
} from '../../../app/reducers/notification/notification.reducer';
import {
  GetCountNotification,
  SetCountNotification,
} from '../../../app/reducers/notification/count-notification.reducer';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import moment from 'moment';

function Header() {
  useEffect(() => window.scrollTo(0, 0));
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      navigate(`/user/search?search=${inputValue}`);
    }
  };

  const fetchCountNotification = async () => {
    try {
      const response = await NotificationAPI.fetchCountNotification();
      dispatch(SetCountNotification(response.data));
    } catch (error) { }
  };

  useEffect(() => {
    fetchCountNotification();
  }, [dispatch]);

  const dataCountNotification = useAppSelector(GetCountNotification);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await NotificationAPI.fetchNotification();
        dispatch(SetNotification(response.data.data.data));
      } catch (error) { }
    };

    fetchNotification();
  }, [dataCountNotification]);

  const dataNotification = useAppSelector(GetNotification);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };

  const AvatarMap = {
    1: comment,
    2: approved,
    3: evaluate,
    4: tym,
    5: refuse,
  };

  const deleteNotification = async (id) => {
    try {
      const response = await NotificationAPI.delete(id);
      if (response.status === 200) {
        const updatedData = dataNotification.filter((item) => item.id !== id);
        dispatch(SetNotification(updatedData));
        const newResponse = await NotificationAPI.fetchNotification();
        const newData = newResponse.data.data.data;
        dispatch(SetNotification(newData));
        const newCount = dataCountNotification - 1;
        dispatch(SetCountNotification(newCount));
      }
    } catch (error) { }
  };

  const handleItemClick = (item) => {
    if (item.type === 5) {
      navigate(`/user/my-article/${item.articlesId}`);
    } else {
      navigate(`/user/article/${item.articlesId}`);
    }
  };

  const markAsRead = () => {
    NotificationAPI.markAllAsRead().then(() => {
      fetchCountNotification();
    });
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} className="header-control">
          {/* chuông */}
          <Badge size="small" count={dataCountNotification}>
            <Dropdown
              overlay={
                <>
                  <div style={{ backgroundColor: 'white', marginTop: '20px', marginBottom: '-10px' }}>
                    <Button
                      type="link"
                      style={{ width: '100%', textAlign: 'left' }}
                      onClick={() => markAsRead()}
                    >
                      <u>Đánh dấu tất cả đã đọc</u>
                    </Button>
                  </div>
                  <List
                    style={{ width: '300px' }}
                    className="header-notifications-dropdown"
                    itemLayout="horizontal"
                    dataSource={dataNotification}
                    renderItem={(item) => (
                      <List.Item
                        className={`notification-item ${hoveredItem === item.id ? 'hovered' : ''}`}
                        onMouseEnter={() => handleItemHover(item.id)}
                        onMouseLeave={() => handleItemHover(null)}
                        onClick={() => handleItemClick(item)}
                      >
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                position: 'relative',
                                display: 'inline-block',
                              }}
                            >
                              <Avatar
                                shape="circle"
                                src={avtar}
                                style={{ width: '50px', height: '50px' }}
                              />
                              <Avatar
                                shape="circle"
                                src={AvatarMap[item.type]}
                                style={{
                                  width: '25px',
                                  height: '25px',
                                  position: 'absolute',
                                  bottom: '-5px',
                                  right: 0,
                                }}
                              />
                            </div>
                          }
                          title={
                            <span
                              style={{
                                fontWeight: !item.status ? 'bold' : '400',
                              }}
                            >
                              {item.contentActivity}
                              {!item.status ? (
                                <div
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: 'blue',
                                    borderRadius: '55%',
                                    float: 'right', // Đẩy dấu chấm xanh sang góc trên bên phải
                                    marginRight: '-8px',
                                    marginTop: '-35px',
                                  }}
                                />
                              ) : null}
                            </span>
                          }
                          description={
                            <>
                              <ClockCircleFilled /> {moment(item.createdDate).format('DD/MM/YYYY')}
                            </>
                          }
                        />
                        {hoveredItem === item.id && (
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item
                                  key="delete"
                                  onClick={() => deleteNotification(item.id)}
                                >
                                  <a href="# ">Xóa</a>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={['click']}
                          >
                            <Button
                              shape="circle"
                              style={{
                                border: 'none',
                                boxShadow: 'none',
                                right: '0',
                              }}
                              className="notification-options absolute "
                              icon={<MoreOutlined />}
                            />
                          </Dropdown>
                        )}
                      </List.Item>
                    )}
                  />
                </>
              }
              trigger={['click']}
              visible={isOpen}
              onVisibleChange={toggleNotifications}
              placement="bottomRight"
              overlayClassName="notification-dropdown"
            >
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <BellFilled />
              </a>
            </Dropdown>
          </Badge>
          <Link to="/sign-in" className="btn-sign-in">
            <UserOutlined />
            <span>Sign in</span>
          </Link>
          <Input
            className="header-search"
            placeholder="Type here..."
            prefix={
              <Link to={`/user/search?search=${inputValue}`}>
                <SearchOutlined />
              </Link>
            }
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </Col>
      </Row>
    </>
  );
}

export default Header;

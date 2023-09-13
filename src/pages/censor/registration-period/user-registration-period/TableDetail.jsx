import React, { useEffect } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { CensorRegistrationUserAPI } from "../../../../apis/censor/registration-user/registration-user.api";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { GetUser, SetUser } from "../../../../app/reducers/users/users.reducer";
import { SetRegistrationPeriod } from "../../../../app/reducers/registration-period/registration-period.reducer";
import { useRef } from "react";
import Highlighter from "react-highlight-words";

const TableRegistration = (props) => {
  const numberAll = props.numberAll;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSelectedRowKeys, setDataSelectedRowKeys] = useState([]);
  const data = useAppSelector(GetUser);
  const onSelectChange = (newSelectedRowKeys) => {
    const newData = [];
    // eslint-disable-next-line array-callback-return
    data.filter((el) => {
      if (
        newSelectedRowKeys.filter((newEl) => el.idUser === newEl).length !== 0
      ) {
        newData.push({
          idRegistrationPeriod: el.idUserRegist,
          usersId: el.idUser,
          numberArticles: el.numberArticles,
          reminderStatus: 0,
        });
      }
    });
    setDataSelectedRowKeys(newData);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  // useEffect(() => {
  //   fetchData();
  // }, [currentPage]);
  // const fetchData = () => {
  //   CensorRegistrationUserAPI.fetchAll({
  //     page: currentPage - 1,
  //   }).then((response) => {
  //     dispatch(SetUser(response.data.data.censorUserInRegistrationReponses));
  //     setTotalPages(response.data.data.totalPages);
  //   });
  // };
  const fetchAll = () => {
    CensorRegistrationUserAPI.fetchAll({}, id).then((response) => {
      const data = response.data.data.censorUserInRegistrationReponses.map(
        (row, index) => ({ ...row, key: row.idUser })
      );
      dispatch(SetUser(data));
      let dem = 0;
      response.data.data.censorUserInRegistrationReponses.forEach((el) => {
        dem = dem + el.numberArticles;
      });
      response.data.data.registrationPeriod.restNumber = dem;
      const dataRes = response.data.data.registrationPeriod;
      dispatch(SetRegistrationPeriod(dataRes));
    });
  };

  const handleChange = (record, newValue) => {
    if (newValue === undefined) {
      newValue = 0;
    }
    const newData = [...data];
    const dataIndex = newData.findIndex(
      (item) => item.idUser === record.idUser
    );
    newData[dataIndex] = { ...newData[dataIndex], numberArticles: newValue };
    dispatch(SetUser(newData));
  };

  const deleteAll = (data) => {
    CensorRegistrationUserAPI.delete(data, id).then((response) => {
      if (response.data) {
        message.success("Xóa thành công");
        setDataSelectedRowKeys([]);
        setSelectedRowKeys([]);
        fetchAll();
      } else {
        message.error("Xóa thất bại");
      }
    });
  };

  const updateAll = (data) => {
    CensorRegistrationUserAPI.update(data, id).then((response) => {
      if (response.data) {
        message.success("Update thành công");
        fetchAll();
      } else {
        message.error("Update thất bại");
      }
    });
  };
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 110,
              height: 40,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
            style={{
              height: 40,
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
            style={{
              height: 40,
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      align: "center",
      width: 50,
      render: (text) => <span className="align-middle">{text}</span>,
    },
    {
      title: "Mã giảng viên",
      dataIndex: "code",
      render: (text) => <span>{text}</span>,
      ...getColumnSearchProps("code"),
    },
    {
      title: "Tên giảng viên",
      dataIndex: "name",
      align: "center",
      render: (text) => <span className="align-middle">{text}</span>,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số lượng bài viết tối thiểu",
      dataIndex: "numberArticle",
      align: "center",
      render: (_, record) => {
        let number = record.numberArticles;
        return (
          <>
            <Space>
              <Input
                type="number"
                defaultValue={number}
                min={0}
                max={2147483647}
                onChange={(el) => handleChange(record, el.target.valueAsNumber)}
              />
            </Space>
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "active",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhập">
            <Button
              onClick={() => {
                if (!record.numberArticles) {
                  Modal.error({
                    title: "Thông báo",
                    content: "Mời bạn nhập số lượng bài viết tối thiểu.",
                    okText: "Đồng ý",
                  });
                  return;
                }
                if (numberAll < record.numberArticles) {
                  Modal.error({
                    title: "Thông báo",
                    content:
                      "Số lượng bài viết chia cho giảng viên nhiều hơn quy định",
                    okText: "Đồng ý",
                  });
                  return;
                }
                if (record.numberArticles <= 0) {
                  Modal.error({
                    title: "Thông báo",
                    content: "Số lượng bài viết tối thiểu phải lớn hơn 0.",
                    okText: "Đồng ý",
                  });
                  return;
                }
                Modal.confirm({
                  title: "Xác nhận cập nhật",
                  content: "Bạn có chắc chắn muốn cập nhật dữ liệu này?",
                  okText: "Đồng ý",
                  cancelText: "Hủy",
                  onOk() {
                    const request = {
                      idRegistrationPeriod: record.idUserRegist,
                      usersId: record.idUser,
                      numberArticles: record.numberArticles,
                      reminderStatus: 0,
                    };
                    updateAll([request]);
                  },
                });
              }}
              style={{ color: "#fff", fontSize: "16px" }}
              className="bg-orange-400  hover:bg-orange-300  hover:border-orange-300 mx-5"
            >
              <EditOutlined className="icon" />
            </Button>
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              type="ghost"
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa dữ liệu này?",
                  okText: "Đồng ý",
                  cancelText: "Hủy",
                  onOk() {
                    const request = {
                      idRegistrationPeriod: record.idUserRegist,
                      usersId: record.idUser,
                      numberArticles: record.numberArticles,
                      reminderStatus: 0,
                    };
                    deleteAll([request]);
                  },
                });
              }}
              style={{ color: "#fff", fontSize: "16px" }}
              className="bg-red-500  hover:bg-red-400  hover:border-red-400 mx-5"
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <Col span={12}>
          <h1 style={{ fontSize: "18px" }}>Danh sách giảng viên trong đợt</h1>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <Button
            type="ghost"
            style={{ color: "#fff" }}
            onClick={() => {
              if (dataSelectedRowKeys.length === 0) {
                Modal.error({
                  title: "Thông báo",
                  content: "Mời bạn chọn giảng viên !!!",
                  okText: "Đồng ý",
                });
                return;
              }
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa dữ liệu này?",
                okText: "Đồng ý",
                cancelText: "Hủy",
                onOk() {
                  deleteAll(dataSelectedRowKeys);
                },
              });
            }}
            className="bg-red-500  hover:bg-red-400  hover:border-red-400 mx-5"
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              if (dataSelectedRowKeys.length === 0) {
                Modal.error({
                  title: "Thông báo",
                  content: "Mời bạn chọn giảng viên !!!",
                  okText: "Đồng ý",
                });
                return;
              }
              if (dataSelectedRowKeys.filter((el) => !el.number).length !== 0) {
                Modal.error({
                  title: "Thông báo",
                  content: "Số lượng bài viết tối thiểu phải lớn hơn 0.",
                  okText: "Đồng ý",
                });
                return;
              }
              console.log();
              if (numberAll < dataSelectedRowKeys.length) {
                Modal.error({
                  title: "Thông báo",
                  content:
                    "Số lượng bài viết chia cho giảng viên nhiều hơn quy định",
                  okText: "Đồng ý",
                });
                return;
              }
              Modal.confirm({
                title: "Xác nhận cập nhật",
                content: "Bạn có chắc chắn muốn cập nhật dữ liệu này?",
                okText: "Đồng ý",
                cancelText: "Hủy",
                onOk() {
                  updateAll(dataSelectedRowKeys);
                },
              });
            }}
            type="primary"
          >
            Cập nhập
          </Button>
        </Col>
      </Row>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{
          defaultCurrent: 1, // Thay đổi số này thành dòng bạn muốn bắt đầu
          pageSize: 5, // Số dòng trên mỗi trang
          showQuickJumper: true,
          total: data.length, // Tổng số dòng
        }}
      />
    </div>
  );
};
export default TableRegistration;

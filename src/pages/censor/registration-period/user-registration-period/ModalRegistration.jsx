import React, { useEffect, useRef } from "react";
import { Button, Col, Input, Modal, Row, Space, Table, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { CensorRegistrationUserAPI } from "../../../../apis/censor/registration-user/registration-user.api";
import {
  GetRegistrationUser,
  SetRegistrationUser,
} from "../../../../app/reducers/registration-user/registration-user.reducer";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useState } from "react";
import { SetUser } from "../../../../app/reducers/users/users.reducer";
import { SetRegistrationPeriod } from "../../../../app/reducers/registration-period/registration-period.reducer";
import Highlighter from "react-highlight-words";

const ModalRegistration = (props) => {
  const dispatch = useAppDispatch();
  const { modalOpen, setModalOpen, id, numberAll } = props;
  const [dataFerch, setDataFerch] = useState([]);

  const [dataSelectedRowKeys, setDataSelectedRowKeys] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleChange = (record, newValue) => {
    if (!newValue || newValue === 0) {
      newValue = 1;
    }
    const newData = [...dataFerch];
    const dataIndex = newData.findIndex(
      (item) => item.idUser === record.idUser
    );
    newData[dataIndex] = { ...newData[dataIndex], numberArticles: newValue };
    setDataFerch(newData);
  };

  useEffect(() => {
    setDataFerch(dataFerch);
    const newData = [];
    // eslint-disable-next-line array-callback-return
    dataFerch.filter((el) => {
      if (selectedRowKeys.filter((newEl) => el.idUser === newEl).length !== 0) {
        newData.push({
          idRegistrationPeriod: id,
          usersId: el.idUser,
          numberArticles: el.numberArticles,
          reminderStatus: 0,
        });
      }
    });
    setDataSelectedRowKeys(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFerch]);

  const setAllArtcle = () => {
    if (dataSelectedRowKeys.length === 0) {
      Modal.error({
        title: "Thông báo",
        content: "Mời bạn chọn giảng viên !!!",
        okText: "Đồng ý",
      });
      return;
    }
    if (numberAll < dataSelectedRowKeys.length) {
      Modal.error({
        title: "Thông báo",
        content: "Số lượng bài viết chia cho giảng viên nhiều hơn quy định",
        okText: "Đồng ý",
      });
      return;
    }
    let chiaDiem = 0;
    const dataIndex = [];
    for (
      let index = 1;
      index <= Math.ceil(numberAll / dataSelectedRowKeys.length);
      index++
    ) {
      // eslint-disable-next-line no-loop-func
      data.forEach((item) => {
        let dem = true;
        selectedRowKeys.forEach((el) => {
          if (item.idUser === el) dem = false;
          return;
        });
        if (!dem) {
          chiaDiem++;

          if (
            chiaDiem <= numberAll &&
            chiaDiem > numberAll - dataSelectedRowKeys.length
          ) {
            item = {
              ...item,
              numberArticles: index,
            };
          }
        }

        if (
          chiaDiem <= numberAll &&
          chiaDiem > numberAll - dataSelectedRowKeys.length
        ) {
          dataIndex.push(item);
        }
      });
    }
    dataIndex.sort((a, b) => a.stt - b.stt);

    setDataFerch(dataIndex);
  };
  //filter
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
          height: "120px",
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
              width: 90,
              height: 35,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 35,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            style={{
              marginTop: -12,
            }}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            style={{
              marginTop: -12,
            }}
            onClick={() => {
              close();
            }}
          >
            Close
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
      align: "center",
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
      dataIndex: "numberArticles",
      align: "center",
      render: (_, record) => {
        let number = record.numberArticles;
        return (
          <>
            <Space>
              <Input
                type="number"
                value={number}
                min={1}
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
          <Button
            type="ghost"
            onClick={() => {
              if (record.numberArticles === undefined) {
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
                    idRegistrationPeriod: id,
                    usersId: record.idUser,
                    numberArticles: record.numberArticles,
                    reminderStatus: 0,
                  };
                  updateAll([request]);
                },
              });
            }}
            style={{ color: "#fff", fontSize: "16px" }}
            className="bg-green-400  hover:bg-green-300  hover:border-green-300 mx-5"
          >
            <UserAddOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = () => {
    CensorRegistrationUserAPI.fetchUserNotInRes({}, id).then((response) => {
      const data = response.data.data.map((row, index) => ({
        ...row,
        key: row.idUser,
        numberArticles: 1,
      }));
      dispatch(SetRegistrationUser(data));
      setDataFerch(data);
    });
  };

  const fetchAllRes = () => {
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

  const data = useAppSelector(GetRegistrationUser);

  const handleOk = () => {
    setModalOpen(false);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const updateAll = (data) => {
    CensorRegistrationUserAPI.update(data, id).then((response) => {
      if (response.data) {
        message.success("Thêm giảng viên vào đợt thành công");
        fetchAllRes();
        handleCancel();
      } else {
        message.error("Thêm giảng viên vào đợt thất bại");
      }
    });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    const newData = [];
    // eslint-disable-next-line array-callback-return
    dataFerch.filter((el) => {
      if (
        newSelectedRowKeys.filter((newEl) => el.idUser === newEl).length !== 0
      ) {
        newData.push({
          idRegistrationPeriod: id,
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

  return (
    <>
      <Modal
        // title="Thêm giảng viên vào đợt"
        width={"60%"}
        style={{ top: "20px" }}
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Row>
            <Col span={12}>
              <h1>Danh sách giảng viên</h1>
            </Col>
            <Col span={12} className="flex justify-end items-center">
              <Button
                type="ghost"
                onClick={() => {
                  setAllArtcle();
                }}
                style={{ color: "#fff", fontSize: "16px" }}
                className="bg-green-400  hover:bg-green-300  hover:border-green-300 mx-5"
              >
                Chia đều bài
              </Button>
              <Button
                type="ghost"
                onClick={() => {
                  if (dataSelectedRowKeys.length === 0) {
                    Modal.error({
                      title: "Thông báo",
                      content: "Mời bạn chọn giảng viên !!!",
                      okText: "Đồng ý",
                    });
                    return;
                  }
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
                style={{ color: "#fff", fontSize: "16px" }}
                className="bg-green-400  hover:bg-green-300  hover:border-green-300 mx-5"
              >
                Phân bài
              </Button>
            </Col>
          </Row>
          <Table
            rowSelection={{
              ...rowSelection,
            }}
            id="tableRes"
            columns={columns}
            dataSource={dataFerch}
            pagination={{
              defaultCurrent: 1, // Thay đổi số này thành dòng bạn muốn bắt đầu
              pageSize: 5, // Số dòng trên mỗi trang
              showQuickJumper: true,
              total: dataFerch.length, // Tổng số dòng
            }}
          />
        </div>
      </Modal>
    </>
  );
};
export default ModalRegistration;

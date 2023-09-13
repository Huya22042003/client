import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
  Select,
  DatePicker,
  Col,
  Row,
  message,
  Modal,
} from "antd";
import {
  PlusOutlined,
  ClearOutlined,
  SearchOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import {
  GetRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../app/reducers/registration-period/registration-period.reducer";
import { GetUser } from "../../../app/reducers/users/users.reducer";
import moment from "moment";
import { Link } from "react-router-dom";
import "./index.css";
import Highlighter from "react-highlight-words";
import { CensorRegistrationUserAPI } from "../../../apis/censor/registration-user/registration-user.api";
export default function TeacherRegistration() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [detailRegistrationPeriod, setDetailRegistrationPeriod] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [check, setCheck] = useState(false);
  const [status, setStatus] = useState("");
  const [numArticles, setNumArticles] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Start excel
  const [showModalExcel, setShowModalExcel] = useState(false);
  const handleOpenModalExcel = () => {
    setShowModalExcel(true);
  };
  // End excel

  useEffect(() => {
    CensorRegistrationPeriodAPI.fetchAll().then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  }, [dispatch]);

  const data = useAppSelector(GetRegistrationPeriod);
  const selectedTeachers = useAppSelector(GetUser);
  const lstUserIdOnly = [];

  selectedTeachers.forEach((user) => {
    lstUserIdOnly.push(user.key);
  });

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    const data = {
      search: search,
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      status: status,
      numberArticles: numArticles,
      page: current - 1,
    };
    CensorRegistrationPeriodAPI.fetchAll(data).then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  };

  let dataMap = [];
  if (check) {
    dataMap = data.map((item) => {
      const fromDateFormatted = moment(item.fromDate).format("DD/MM/YYYY");
      const toDateFormatted = moment(item.toDate).format("DD/MM/YYYY");
      return {
        ...item,
        date: `${fromDateFormatted} - ${toDateFormatted}`,
      };
    });
  }
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
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (text) => <span>{text}</span>,
      ...getColumnSearchProps("code"),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        if (text.length > 10) {
          return <span>{text.slice(0, 10)}...</span>;
        }
        return <span>{text}</span>;
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số lượng BV quy định",
      dataIndex: "numberArticle",
      key: "numberArticle",
      render: (text, record) => {
        return `${
          record.numberArticleExistInRes === undefined
            ? "0"
            : record.numberArticleExistInRes
        } / ${record.numberArticles}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "registrationPeriodStatus",
      key: "registrationPeriodStatus",
      render: (registrationPeriodStatus) =>
        parseInt(registrationPeriodStatus) === 0 ||
        registrationPeriodStatus === "ACTIVE"
          ? "Hoạt động"
          : "Không hoạt động",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Detail">
            <Button className="detail-button">
              <Link
                to={`/censor/registration-period/${record.id}`}
                onClick={() => handleUpdateClick(record)}
              >
                <FormOutlined className="icon" />
              </Link>
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const handleUpdateClick = (record) => {
    setDetailRegistrationPeriod(record);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    fetchData();
  };

  const handleClearButtonClick = () => {
    setSearch("");
    setStatus("");
    setNumArticles(null);
    setStartDate(null);
    setEndDate(null);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const handleAddTeachersToPeriod = () => {
    if (selectedRowKeys.length > 0) {
      const data = {
        lstUserId: lstUserIdOnly,
        lstRegistrationId: selectedRowKeys,
      };
      Modal.confirm({
        title: "Xác nhận thêm giảng viên vào đợt",
        content: "Bạn có chắc chắn muốn thêm giảng viên vào đợt không?",
        okText: "Đồng ý",
        okType: "primary",
        cancelText: "Hủy",
        onOk: () => {
          CensorRegistrationUserAPI.addListUserInListRegistration(data)
            .then(() => {
              message.success("Thêm giảng viên vào đợt thành công!");
              fetchData();
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                message.error(error.response.data.message);
              } else {
                message.error("Lỗi.");
              }
            });
        },
      });
    } else {
      message.error("Vui lòng chọn đợt bạn muốn thêm giảng viên");
    }
  };

  return (
    <>
      <Card className="mb-2">
        <h1 style={{ fontSize: 20, textAlign: "center" }}>
          TÌM KIẾM ĐỢT ĐĂNG KÝ
        </h1>
        <Row className="justify-between">
          <Col span={11}>
            {/* Hàng 1 */}
            <div>
              <h1 className="label">Tìm kiếm theo tên hoặc mã:</h1>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc mã..."
              />
            </div>
            <div>
              <h1 className="label">Số lượng bài viết: </h1>
              <Input
                value={numArticles}
                onChange={(e) => setNumArticles(e.target.value)}
                placeholder="Số lượng bài viết"
              />
            </div>
          </Col>
          <Col span={11}>
            {/* Hàng 2 */}
            <div>
              <h1 className="label">Trạng thái: </h1>
              <Select
                style={{ width: "100%", height: 40 }}
                placeholder="Chọn status"
                value={status}
                onChange={(value) => setStatus(value)}
              >
                <Select.Option value="">---Trạng thái---</Select.Option>
                <Select.Option value="0">Hoạt động</Select.Option>
                <Select.Option value="1">Không hoạt động</Select.Option>
              </Select>
            </div>
            <div>
              <h1 className="label">Ngày diễn ra đợt: </h1>
              <Row className="justify-between">
                <Col span={11}>
                  <DatePicker
                    value={startDate}
                    onChange={(el) => setStartDate(el)}
                    className="datePicker"
                    placeholder="Ngày bắt đầu"
                    style={{ height: 40, width: "100%" }}
                  />
                </Col>
                <Col span={11}>
                  <DatePicker
                    value={endDate}
                    onChange={(el) => setEndDate(el)}
                    className="datePicker"
                    placeholder="Ngày kết thúc"
                    style={{ height: 40, width: "100%" }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Col className="flex justify-center mt-5">
          <div>
            <Button
              type="primary"
              className="searchButton"
              onClick={handleClearButtonClick}
              icon={<ClearOutlined />}
              style={{ marginRight: 5 }}
            >
              Clear
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              className="searchButton"
              onClick={handleSearchButtonClick}
              icon={<SearchOutlined />}
              style={{ marginLeft: 5 }}
            >
              Tìm kiếm
            </Button>
          </div>
        </Col>
      </Card>
      <Card>
        <div>
          <div className="flex flex-row-reverse mt-5">
            <div>
              <span className=" mr-5">
                <Tooltip title="Thêm giảng viên vào đợt">
                  <button
                    className="add-button"
                    onClick={handleAddTeachersToPeriod}
                  >
                    <PlusOutlined className="mr-1" />
                    Thêm giảng viên vào đợt
                  </button>
                </Tooltip>
              </span>
              <span>
                <Tooltip title="Tạo đợt đăng kí">
                  <button
                    className="add-button"
                    onClick={() => {
                      setShowModal(true);
                      setDetailRegistrationPeriod(null);
                    }}
                  >
                    <PlusOutlined className="mr-1" />
                    Tạo đợt đăng ký
                  </button>
                </Tooltip>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
          />
        </div>
        <div className="mt-5 text-center">
          <Pagination
            simple
            current={current}
            onChange={(value) => {
              setCurrent(value);
            }}
            total={total * 10}
          />
        </div>
      </Card>
    </>
  );
}

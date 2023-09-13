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
} from "antd";
import {
  PlusOutlined,
  ClearOutlined,
  SearchOutlined,
  FormOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import {
  GetRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../app/reducers/registration-period/registration-period.reducer";
import ModalThem from "./ModalAdd";
import moment from "moment";
import { Link } from "react-router-dom";
import "./index.css";
import Highlighter from "react-highlight-words";
import ModalExcelmportFile from "./ModalExcelmportFile";

export default function RegistrationPeriod() {
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
  const [key, setKey] = useState(1);

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
          <Tooltip title="Chi tiết">
            <Link
              to={`/censor/registration-period/${record.id}`}
              onClick={() => handleUpdateClick(record)}
            >
              <Button className="detail-button">
                <FormOutlined className="icon" />{" "}
              </Button>
            </Link>
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

  return (
    <>
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          width={1200}
        />
      )}
      <Card className="mb-2">
        <div className="-mt-5">
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
                  {/* <div className="flex justify-between"> */}
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
                {/* </div> */}
              </div>
            </Col>
          </Row>
          <Col className="flex justify-center mt-5">
            {/* Hàng chứa hai nút */}
            <div>
              <Button
                type="primary"
                className="searchButton1"
                onClick={handleClearButtonClick}
                icon={<ClearOutlined />}
                style={{ marginRight: 5 }}
              >
                Làm mới
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                className="searchButton1"
                onClick={handleSearchButtonClick}
                icon={<SearchOutlined />}
                style={{ marginLeft: 5 }}
              >
                Tìm kiếm
              </Button>
            </div>
          </Col>
        </div>
      </Card>
      <Card>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span>
                <Tooltip title="Download Excel">
                  <button
                    onClick={handleOpenModalExcel}
                    style={{
                      color: "#fff",
                      borderRadius: "5px",
                    }}
                    className="download-button bg-green-500 hover:bg-green-400  hover:border-green-400 mx-5"
                  >
                    <DownloadOutlined className="mr-1" />
                    Import File
                  </button>
                </Tooltip>
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
            <ModalExcelmportFile
              visible={showModalExcel}
              onClose={() => setShowModalExcel(false)}
              fetchData={() => fetchData()}
            />
          </div>
        </div>

        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={dataMap}
            rowKey="id"
            pagination={false}
            key={key}
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

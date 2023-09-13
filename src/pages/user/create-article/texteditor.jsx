import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import {
  Input,
  Card,
  Button,
  Row,
  Col,
  Select,
  message,
  Alert,
  Modal,
} from "antd";
import {
  ExclamationCircleOutlined,
  FolderAddOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import {
  AddArticles,
  UpdateArticles,
} from "../../../app/reducers/articles/articles.reducer";
import {
  connectStompClient,
  getStompClient,
} from "../../../apis/stomp-client/config";
const Texteditor = () => {
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [content, setContent] = useState("");
  const { id } = useParams();
  const [isUpdatePage, setIsUpdatePage] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [registrationPeriod, setRegistrationPeriod] = useState([]);
  const [selectedRegistrationPeriodId, setSelectedRegistrationPeriodId] =
    useState("");
  const dispatch = useAppDispatch();
  // eslint-disable-next-line no-unused-vars
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    connectStompClient();
  }, []);
  const navigate = useNavigate();
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleHashtagsChange = (value) => {
    setHashtags(value);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const validateForm = () => {
    if (title.trim().length < 6 || title.trim().length > 250) {
      message.error("Tiêu đề bài viết phải trong khoảng 6 đến 225 kí tự");
      return false;
    }
    if (hashtags.length === 0) {
      message.error("Hashtags không được trống");
      return false;
    }
    if (
      content.trim().length === 0 ||
      content.trim().replace(/<p>|<\/p>|<br>|&nbsp;|\s+/gi, "").length === 0 ||
      content == null ||
      !content
    ) {
      message.error("Nội dung không được trống");
      return false;
    }
    return true;
  };

  const config = {
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ["source", "fullsize", "print", "about"],
    toolbarButtonSize: "middle",
    theme: "default",
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 400,
    direction: "ltr",
    language: "en",
    debugLanguage: false,
    i18n: "en",
    tabIndex: -1,
    toolbar: true,
    enter: "P",
    useSplitMode: false,
    colorPickerDefaultTab: "background",
    imageDefaultWidth: 400,
    removeButtons: [],
    disablePlugins: ["paste", "stat"],
    events: {},
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    placeholder: "",
    showXPathInStatusbar: false,
  };

  const options = [{ value: "fptpolytechnic", label: "fptpolytechnic" }];

  const processText = (text) => {
    const strippedText = text
      .replace(/<\/?[^>]+(>|$)/g, " ")
      .replace(/(&nbsp;)+/g, " ");
    const words = strippedText.split(" ");
    const first60Words = words.slice(0, 60);
    const first60WordsString = first60Words.join(" ");
    return first60WordsString;
  };

  const [modal, contextHolder] = Modal.useModal();
  const confirm = () => {
    return new Promise((resolve, reject) => {
      const modalInstance = modal.confirm({
        title: "Bạn có chắc thực hiện hành động?",
        icon: <ExclamationCircleOutlined />,
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          resolve();
          modalInstance.destroy();
        },
        onCancel: () => {
          reject();
          modalInstance.destroy();
        },
      });
    });
  };

  let stompClient = getStompClient();

  const connect = () => {
    stompClient.connect({}, () => {});
  };

  useEffect(() => {
    if (stompClient != null) {
      connect();
    }
    return () => {
      if (stompClient != null) {
        getStompClient().disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stompClient]);

  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }

    const descriptive = processText(content);
    const data = {
      title: title,
      hashtag: hashtags,
      content: content,
      descriptive: descriptive,
      idRegistrationPeriod: selectedRegistrationPeriodId,
    };

    if (!isUpdatePage) {
      setSubmitLoading(true);
      confirm({
        title: "Xác nhận gửi yêu cầu phê duyệt?",
        content: "Bạn có chắc chắn muốn gửi yêu cầu phê duyệt?",
        okText: "Xác nhận",
        cancelText: "Hủy",
      })
        .then(() => {
          // Người dùng đã nhấn OK
          MyArticleAPI.createArticleToCensor(data)
            .then(() => {
              navigate("/user/my-article");
              message.success("Gửi yêu cầu phê duyệt thành công!");
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
            })
            .finally(() => {
              setSubmitLoading(false); // Tắt trạng thái "loading" sau khi hoàn thành
            });
        })
        .catch(() => {
          setSubmitLoading(false); // Tắt trạng thái "loading" nếu người dùng nhấn hủy
        });
    } else {
      setSubmitLoading(true);
      confirm({
        title: "Xác nhận gửi yêu cầu phê duyệt?",
        content: "Bạn có chắc chắn muốn gửi yêu cầu phê duyệt?",
        okText: "Xác nhận",
        cancelText: "Hủy",
      })
        .then(() => {
          MyArticleAPI.updateArticleTCensor(data, id)
            .then((result) => {
              dispatch(UpdateArticles(result.data.data));
              navigate("/user/my-article");
              message.success("Gửi yêu cầu phê duyệt thành công!");
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
            })
            .finally(() => {
              setSubmitLoading(false); // Tắt trạng thái "loading" sau khi hoàn thành
            });
        })
        .catch(() => {
          setSubmitLoading(false); // Tắt trạng thái "loading" nếu người dùng nhấn hủy
        });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const descriptive = processText(content);
    const data = {
      title: title,
      hashtag: hashtags,
      content: content,
      descriptive: descriptive,
      idRegistrationPeriod: selectedRegistrationPeriodId,
    };

    try {
      if (!isUpdatePage) {
        await confirm({
          title: "Xác nhận tạo bản nháp?",
          content: "Bạn có chắc chắn muốn tạo bản nháp?",
          okText: "Xác nhận",
          cancelText: "Hủy",
        });

        setSubmitLoading(true);

        const result = await MyArticleAPI.createDraftArticle(data);
        dispatch(AddArticles(result.data.data));
        navigate(`/user/my-article`);
        message.success("Đã lưu bản nháp thành công!");
      } else {
        await confirm({
          title: "Xác nhận cập nhật bản nháp?",
          content: "Bạn có chắc chắn muốn cập nhật bản nháp?",
          okText: "Xác nhận",
          cancelText: "Hủy",
        });

        setSubmitLoading(true);

        const result = await MyArticleAPI.updateDraftArticle(data, id);
        dispatch(UpdateArticles(result.data.data));
        navigate(`/user/my-article`);
        message.success("Đã cập nhật bản nháp thành công!");
      }
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRegistrationPeriodChange = (value, option) => {
    setSelectedRegistrationPeriodId(value);
  };

  useEffect(() => {
    MyArticleAPI.fetchRegistraition().then((res) => {
      setRegistrationPeriod(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedRegistrationPeriodId(res.data.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    setIsUpdatePage(!window.location.href.includes("create-article"));
    if (isUpdatePage) {
      MyArticleAPI.detailMyArticle(id)
        .then((result) => {
          const { title, hashtags, content } = result.data.data;
          setTitle(title);
          setHashtags(hashtags.split(", "));
          setContent(content);
        })
        .catch((error) => {
          setTitle("");
          setHashtags([]);
          setContent("");
        });
    }
  }, [id, isUpdatePage]);

  return (
    <Card>
      <div className="-mt-7">
        {contextHolder}
        {error && <Alert message={error} type="error" showIcon />}
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "8px" }}>Đợt viết bài:</label>
          <Select
            value={selectedRegistrationPeriodId}
            style={{
              width: 320,
              borderRadius: 8,
              marginBottom: 15,
              marginTop: 15,
              border: "1px solid #ccc",
            }}
            bordered={false}
            onChange={handleRegistrationPeriodChange} // Gọi hàm handleSelectChange khi giá trị thay đổi
          >
            {registrationPeriod.map((period) => (
              <Select.Option key={period.id} value={period.id}>
                {period.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Input
          addonBefore="Tiêu đề"
          value={title}
          onChange={handleTitleChange}
        />
        <Row className="mt-5 mb-2">
          <Col span={17}>
            <Select
              mode="tags"
              className="w-11/12"
              size="large"
              onChange={handleHashtagsChange}
              tokenSeparators={[","]}
              options={options}
              placeholder="Hashtag"
              value={hashtags}
            />
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              shape="round"
              icon={<FolderAddOutlined />}
              size="large"
              onClick={handleSave}
              className="flex justify-center items-center"
            >
              Lưu
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type={isUpdatePage ? "default" : "primary"}
              shape="round"
              icon={<SendOutlined />}
              size="large"
              onClick={handlePublish}
              className="flex justify-center items-center"
            >
              {isUpdatePage ? "Cập nhập" : "Tạo bài viết"}
            </Button>
          </Col>
        </Row>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={handleContentChange}
        />
      </div>
    </Card>
  );
};

export default Texteditor;

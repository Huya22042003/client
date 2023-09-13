import { Button, message, Popconfirm, Tooltip } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { DeleteOutlined } from "@ant-design/icons";
import {
  DeleteCategory,
  SetCategory,
} from "../../../app/reducers/category/category.reducer";
import { CategoryAPI } from "../../../apis/censor/category/category.api";

const DeleteConfirm = (props) => {
  const dispatch = useAppDispatch();

  const fetchData = () => {
    CategoryAPI.fetchAll().then((response) => {
      dispatch(SetCategory(response.data.data.data));
    });
  };

  const deleteColor = (id) => {
    CategoryAPI.delete(id).then(
      (response) => {
        dispatch(DeleteCategory(id));
        fetchData();
        message.success("Xóa thành công");
      },
      (err) => {
        message.error("Xóa thất bại");
      }
    );
  };
  const confirm = (e) => {
    deleteColor(props.id);
  };
  const cancel = (e) => {
    message.error("Click on No");
  };

  return (
    <Popconfirm
      title="Delete the task"
      description="Are you sure to delete this task?"
      onConfirm={confirm}
      onCancel={cancel}
      color="cyan"
      okText="Yes"
      cancelText="No"
    >
      <Tooltip title="Delete demo">
        <Button
          type="primary"
          className="bg-red-400 text-white hover:bg-red-300"
        >
          <DeleteOutlined />
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};
export default DeleteConfirm;

import { Avatar, Button, List } from "antd";

const ResultUser = (props) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{ width: "60px", height: "60px" }}
                  src={item.avatar}
                />
              }
              title={<span >{item.name}</span>}
              description={item.content}
            />
            <Button
              className="rounded-3xl  px-4 py-2  h-9 leading-2 "
              style={{
                borderRadius: "30px",
              }}
            >
              Xem chi tiết
            </Button>
          </List.Item>
        )}
      />
    </div>
  );
};
export default ResultUser;

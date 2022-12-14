import React from "react";
import { Popover } from "react-tiny-popover";

export default function CustomPopover(props) {
  const { open, onClose, handleSubmit, noti, content, width } = props;
  return (
    <Popover
      isOpen={open}
      positions={["top"]}
      onClickOutside={onClose}
      content={
        <div
          style={{
            background: "white",
            padding: "10px",
            marginBottom: "5px",
            width: width ? width : "220px",
            borderRadius: "8px",
            border: "gray 0.5px solid",
            zIndex: 50
          }}
        >
          <div style={{ textAlign: "center" }}>
            {noti ? noti : "Bạn có chắc chắn muốn đổi trạng thái?"}
          </div>
          <div
            style={{ borderBottom: "0.5px solid gray", marginTop: "5px" }}
          ></div>
          {content && content}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "3px 20px",
                border: "#1976D2 1px solid",
                color: "white",
                background: "#1976D2",
                borderRadius: "4px",
                cursor: 'pointer'
              }}
              onClick={handleSubmit}
            >
              Đồng ý
            </button>
            <button
              style={{
                padding: "3px 20px",
                border: "gray 1px solid",
                borderRadius: "4px",
                cursor: 'pointer'
              }}
              onClick={onClose}
            >
              Huỷ
            </button>
          </div>
        </div>
      }
    >
      {props.children}
    </Popover>
  );
}

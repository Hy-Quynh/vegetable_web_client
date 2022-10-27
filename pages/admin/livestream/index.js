import { Button, Stack, TextareaAutosize, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../../../components/CustomInput";
import {
  createNewLiveStream,
  getAllLiveStream,
  updateLiveStreamData,
} from "../../../services/live-stream";

export default function LiveStream() {
  const [liveStreamData, setLiveStreamData] = useState({
    video_title: "",
    video_description: "",
    video_link: "",
  });

  const getVideoData = async () => {
    const video = await getAllLiveStream();
    if (video?.data?.payload?.length) {
      setLiveStreamData(video?.data?.payload?.[0]);
    }
  };

  useEffect(() => {
    getVideoData();
  }, []);

  const updateLiveStream = async () => {
    if (!liveStreamData?.video_title?.trim()?.length) {
      return toast.error("Tiêu đề không được không được bỏ trống");
    }

    if (!liveStreamData?.video_link?.trim()?.length) {
      return toast.error("Đường link không được bỏ trống");
    }

    const liveData = {
      videoTitle: liveStreamData?.video_title?.trim(),
      videoDescription: liveStreamData?.video_description?.trim(),
      videoLink: liveStreamData?.video_link?.trim(),
    };

    if (liveStreamData?.video_id) {
      const updateRes = await updateLiveStreamData(
        liveData,
        liveStreamData?.video_id
      );
      if (updateRes?.data?.success) {
        return toast.success("Cập nhât dữ liệu livestream thành công");
      }
    }

    const createRes = await createNewLiveStream(liveData);
    if (createRes?.data?.success) {
      return toast.success("Cập nhât dữ liệu livestream thành công");
    }

    return toast.error("Cập nhât dữ liệu livestream thất bại");
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        color="primary"
        gutterBottom
        sx={{ textAlign: "left" }}
      >
        Quản lí sản phẩm
      </Typography>
      <Typography
        component="p"
        variant="p"
        color="primary"
        gutterBottom
        sx={{ textAlign: "left" }}
      >
        Bằng cách nhập link livestream trên FB vào đây, sẽ hiện thị trên Website
        của bạn
      </Typography>
      <div style={{ width: "80%" }}>
        <CustomInput
          label="Tiêu đề"
          defaultValue=""
          id="post-title"
          variant="filled"
          sx={{ with: "80%" }}
          style={{ marginTop: 11, with: "80%" }}
          value={liveStreamData?.video_title}
          onChange={(event) =>
            setLiveStreamData({
              ...liveStreamData,
              video_title: event.target.value,
            })
          }
        />
        <CustomInput
          label="Link LiveStream"
          defaultValue=""
          id="post-title"
          variant="filled"
          sx={{ with: "80%" }}
          style={{ marginTop: 11, with: "80%" }}
          value={liveStreamData?.video_link}
          onChange={(event) =>
            setLiveStreamData({
              ...liveStreamData,
              video_link: event.target.value,
            })
          }
        />
        <TextareaAutosize
          defaultValue={liveStreamData?.video_description}
          aria-label="minimum height"
          minRows={10}
          placeholder="Nhập mô tả"
          style={{ width: "100%", marginTop: "20px", padding: "10px" }}
          onChange={(event) =>
            setLiveStreamData({
              ...liveStreamData,
              video_description: event.target.value,
            })
          }
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={() => updateLiveStream()}>
            Cập nhật
          </Button>
        </div>
      </div>
    </>
  );
}

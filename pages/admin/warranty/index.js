import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "braft-editor/dist/index.css";
import storage from "../../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { createWarrantyInfo, getAllWarranty, updateWarrantyInfo } from "../../../services/helper";

const maxFileSize = 500000; //500 kb
const controls = [
  "bold",
  "italic",
  "underline",
  "separator",
  "text-indent",
  "text-align",
  "list-ul",
  "list-ol",
  "link",
  "separator",
  "media",
];
const BraftEditor = dynamic(() => import("braft-editor"), {
  ssr: false,
});

export default function Warranty() {
  const [warrantyContent, setWarrantyContent] = useState({
    warranty_id: "",
    warranty_content: "",
    created_day: "",
  });
  const [braftValue, setBraftValue] = useState("");

  const setBraftEditorValue = async (value) => {
    const Braft = (await import("braft-editor")).default;
    setBraftValue(Braft?.createEditorState?.(value));
  };

  useEffect(() => {
    setBraftEditorValue("");
  }, []);

  const customUpload = async (props) => {
    const { file, success, error } = props;
    const imageName = "warranty-" + new Date().getTime();
    const storageRef = ref(storage, imageName);

    const updateImageRes = await uploadBytes(storageRef, file);
    if (updateImageRes) {
      const pathReference = ref(storage, imageName);
      const url = await getDownloadURL(pathReference);
      success({ url });
    } else {
      error("File upload failed");
      toast.warn("File upload failed");
    }
  };

  const validateFn = (file) => {
    let fileSizeError = "File tải lên không thể quá 500 kb";

    if (file.size > maxFileSize) {
      toast.warn(fileSizeError);
      return false;
    }
    return true;
  };

  const getWarranty = async () => {
    const warranty = await getAllWarranty()
    if ( warranty?.data?.payload?.[0]?.warranty_id){
      setWarrantyContent(warranty?.data?.payload?.[0])
      setBraftEditorValue(warranty?.data?.payload?.[0]?.warranty_content)
    }
  }

  useEffect(() => {
    getWarranty()
  }, [])

  const handleUpdateWarranty = async () => {
    if (!warrantyContent?.warranty_content?.toString()?.length){
      return toast.error('Nội dung bảo hành không được bỏ trống')
    }

    if (warrantyContent?.warranty_id?.toString()?.length){
      const updateRes = await updateWarrantyInfo(warrantyContent?.warranty_id, warrantyContent?.warranty_content)
      if ( updateRes?.data?.success){
        return toast.success('Cập nhật thông tin thành công')
      }
    }

    const createRes = await createWarrantyInfo(warrantyContent?.warranty_content)
    if ( createRes?.data?.success){
      return toast.success('Cập nhật thông tin thành công')
    }
    
    return toast.error('Cập nhật thông tin thất bại')
  };

  return (
    <div className="editor-wrapper">
      <BraftEditor
        language="en"
        controls={controls}
        media={{ uploadFn: customUpload, validateFn: validateFn }}
        contentStyle={{
          height: 500,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
        }}
        value={braftValue}
        onChange={(editorState) => {
          setBraftValue(editorState);
          setWarrantyContent({...warrantyContent, warranty_content: editorState.toHTML()});
        }}
      />
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={() => handleUpdateWarranty()}>
          Cập nhật
        </Button>
      </div>
    </div>
  );
}

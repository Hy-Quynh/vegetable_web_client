import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomDialog from "../../CustomDialog";
import { Stack } from "@mui/material";
import ChooseProductModal from "../ChooseProductModal";
import _ from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import {
  createNewPromo,
  getPromoById,
  updatePromoData,
} from "../../../services/product";

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function PromoControlModal(props) {
  const { visible, onClose, type, editPromoId, reloadPage } = props;
  const [promoData, setPromoData] = useState({
    promo_name: "",
    promo_start: "",
    promo_end: "",
    promo_rule: "DISCOUNT",
  });
  const [discountRule, setDiscountRule] = useState({
    type: "PERCENT",
    value: 0,
  });
  const [listFreeProduct, setListFreeProduct] = useState([]);
  const [listPromoProduct, setListPromoProduct] = useState([]);
  const [visibleFreeProductModal, setVisibleFreeProductModal] = useState(false);
  const [visibleChooseProductModal, setVisibleChooseProductModal] =
    useState(false);

  const validateField = () => {
    const { promo_name, promo_start, promo_end, promo_rule } = promoData;
    const parseStart = moment(
      moment(promo_start, "YYYY-MM-DD")?.startOf("day").toDate()
    ).format("x");
    const parseEnd = moment(
      moment(promo_end, "YYYY-MM-DD")?.endOf("day").toDate()
    ).format("x");
    const parseCurrent = moment(
      moment(new Date())?.endOf("day").toDate()
    ).format("x");

    const checkNull = _.compact([promo_name, promo_start, promo_end]);

    if (checkNull.length < 3) {
      toast.error(
        "Thông tin tên, ngày bắt đầu, ngày kết thúc không được bỏ trống"
      );
      return false;
    }

    if (parseEnd < parseStart) {
      toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại");
      return false;
    }

    if (promo_rule === "DISCOUNT") {
      if (Number(discountRule?.value) <= 1) {
        toast.error("Giá trị giảm phải lớn hơn 0");
        return false;
      }

      if (
        discountRule?.type === "PERCENT" &&
        Number(discountRule?.value) > 100
      ) {
        toast.error("Phần trăm giảm không được lớn hơn 100");
        return false;
      }
    }

    if (promo_rule === "FREE_PRODUCT" && listPromoProduct?.length === 0) {
      toast.error("Sản phẩm tặng kèm không được để trống");
      return false;
    }

    if (listPromoProduct?.length === 0) {
      toast.error("Sản phẩm trong chương trình khuyến mãi không được bỏ trống");
      return false;
    }
    return true;
  };

  const handleCreateNewPromo = async () => {
    const validateResult = validateField();

    if (validateResult) {
      if (type === "CREATE") {
        const createRes = await createNewPromo({
          promoData,
          discountRule,
          listFreeProduct,
          listPromoProduct,
        });

        if (createRes?.data?.success) {
          reloadPage?.();
          onClose?.();
          return true;
        }
        return false;
      }

      if (type === "UPDATE") {
        const updateRes = await updatePromoData(
          {
            promoData,
            discountRule,
            listFreeProduct,
            listPromoProduct,
          },
          editPromoId
        );

        if (updateRes?.data?.success) {
          reloadPage?.();
          onClose?.();
          return true;
        }
        return false;
      }
    }
  };

  useEffect(() => {
    if (type === "UPDATE" && editPromoId) {
      (async () => {
        const promoRes = await getPromoById(editPromoId);
        const promoData = await promoRes?.data?.payload?.promoData;
        const listFreeProduct = promoRes?.data?.payload?.listFreeProduct || [];
        const listPromoProduct =
          promoRes?.data?.payload?.listPromoProduct || [];
        if (listFreeProduct?.length) setListFreeProduct(listFreeProduct);
        if (listPromoProduct?.length) setListPromoProduct(listPromoProduct);
        setPromoData({
          promo_name: promoData?.promo_name,
          promo_start: formatDate(promoData?.promo_start),
          promo_end: formatDate(promoData?.promo_end),
          promo_rule: promoData?.promo_rule,
        });

        setDiscountRule({
          type: promoData?.rule_type,
          value: promoData?.rule_value,
        });
      })();
    }
  }, []);

  return (
    <>
      <CustomDialog
        onClose={() => onClose?.()}
        visible={visible}
        title={
          type === "CREATE" ? "Thêm mới chương trình" : "Cập nhật chương trình"
        }
        closeTitle="Đóng"
        closeSubmitTitle={"Xác nhận"}
        handleSubmit={() => handleCreateNewPromo?.()}
        maxWidth="800px"
        width="800px"
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="p" component="p">
            Tên chương trình:
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Nhập tên chương trình khuyến mãi"
            size="small"
            sx={{
              "& legend": { display: "none" },
              "& fieldset": { top: 0 },
              width: "100%",
            }}
            value={promoData?.promo_name}
            onChange={(event) => {
              setPromoData({
                ...promoData,
                promo_name: event.target.value,
              });
            }}
          />
        </Box>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Box sx={{ margin: "20px 0", width: "45%" }}>
            <Typography variant="p" component="p">
              Ngày bắt đầu:
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type={"date"}
              sx={{
                "& legend": { display: "none" },
                "& fieldset": { top: 0 },
                width: "100%",
              }}
              size="small"
              value={promoData?.promo_start}
              onChange={(event) => {
                setPromoData({
                  ...promoData,
                  promo_start: event.target.value,
                });
              }}
            />
          </Box>
          <Box sx={{ margin: "20px 0 20px 30px", width: "45%" }}>
            <Typography variant="p" component="p">
              Ngày kết thúc:
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type={"date"}
              size="small"
              sx={{
                "& legend": { display: "none" },
                "& fieldset": { top: 0 },
                width: "100%",
              }}
              value={promoData?.promo_end}
              onChange={(event) => {
                setPromoData({
                  ...promoData,
                  promo_end: event.target.value,
                });
              }}
            />
          </Box>
        </Stack>
        <hr />
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Thể lệ</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={promoData?.promo_rule}
            name="radio-buttons-group"
            onChange={(event) =>
              setPromoData({ ...promoData, promo_rule: event.target.value })
            }
          >
            <FormControlLabel
              value="DISCOUNT"
              control={<Radio />}
              label="Giảm giá"
            />
            {promoData?.promo_rule === "DISCOUNT" ? (
              <div style={{ marginLeft: "30px" }}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={discountRule?.type}
                    name="radio-buttons-group"
                    onChange={(event) => {
                      setDiscountRule({
                        ...discountRule,
                        type: event.target.value,
                      });
                    }}
                  >
                    <FormControlLabel
                      value="PERCENT"
                      control={<Radio />}
                      label="Giảm giá theo phần trăm"
                    />
                    {discountRule?.type === "PERCENT" ? (
                      <div style={{ marginLeft: "30px" }}>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="p" component="p">
                            Nhập số phần trăm giảm:
                          </Typography>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="Nhập số phần trăm giảm"
                            size="small"
                            sx={{
                              "& legend": { display: "none" },
                              "& fieldset": { top: 0 },
                              width: "400px",
                            }}
                            type="number"
                            value={discountRule?.value}
                            onChange={(event) => {
                              setDiscountRule({
                                ...discountRule,
                                value: event.target.value,
                              });
                            }}
                          />
                        </Box>
                      </div>
                    ) : (
                      <></>
                    )}
                    <FormControlLabel
                      value="MONEY"
                      control={<Radio />}
                      label="Giảm theo số tiền"
                    />

                    {discountRule?.type === "MONEY" ? (
                      <div style={{ marginLeft: "30px" }}>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="p" component="p">
                            Nhập số tiền giảm:
                          </Typography>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            placeholder="Nhập số tiền giảm"
                            size="small"
                            sx={{
                              "& legend": { display: "none" },
                              "& fieldset": { top: 0 },
                              width: "400px",
                            }}
                            type="number"
                            value={discountRule?.value}
                            onChange={(event) => {
                              setDiscountRule({
                                ...discountRule,
                                value: event.target.value,
                              });
                            }}
                          />
                        </Box>
                      </div>
                    ) : (
                      <></>
                    )}
                  </RadioGroup>
                </FormControl>
              </div>
            ) : (
              <></>
            )}
            <FormControlLabel
              value="FREE_PRODUCT"
              control={<Radio />}
              label="Tặng kèm sản phẩm"
            />
            {promoData?.promo_rule === "FREE_PRODUCT" ? (
              <div style={{ marginLeft: "30px" }}>
                <div
                  style={{
                    padding: "1px 10px",
                    background: "#3CB914",
                    color: "white",
                  }}
                >
                  {listFreeProduct?.length} Sản phẩm được lựa chọn
                </div>

                <div
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    setVisibleFreeProductModal(true);
                  }}
                >
                  Lựa chọn sản phẩm tặng kèm
                </div>
              </div>
            ) : (
              <></>
            )}
          </RadioGroup>
        </FormControl>
        <hr />
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6" component="b" sx={{ fontWeight: 700 }}>
            Lựa chọn sản phẩm trong chương trình:
          </Typography>
          <div style={{ marginLeft: "30px", marginTop: "10px" }}>
            <div
              style={{
                padding: "1px 10px",
                background: "#3CB914",
                color: "white",
                width: "fit-content",
              }}
            >
              {listPromoProduct?.length} Sản phẩm được lựa chọn
            </div>

            <div
              style={{
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
                marginTop: "10px",
              }}
              onClick={() => {
                setVisibleChooseProductModal(true);
              }}
            >
              Lựa chọn sản phẩm trong chương trình
            </div>
          </div>
        </div>
      </CustomDialog>
      {visibleFreeProductModal && (
        <ChooseProductModal
          visible={visibleFreeProductModal}
          onClose={() => setVisibleFreeProductModal(false)}
          handleSubmit={(lst) => {
            setListFreeProduct(lst);
            setVisibleFreeProductModal(false);
            return true;
          }}
          initData={listFreeProduct}
        />
      )}

      {visibleChooseProductModal && (
        <ChooseProductModal
          visible={visibleChooseProductModal}
          onClose={() => setVisibleChooseProductModal(false)}
          handleSubmit={(lst) => {
            setListPromoProduct(lst);
            setVisibleChooseProductModal(false);
            return true;
          }}
          initData={listPromoProduct}
        />
      )}
    </>
  );
}

import React from "react";
import {
  BLUR_BASE64,
  FORMAT_NUMBER,
  USER_INFO_KEY,
} from "../../utils/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addProductToCart } from "../../utils/common";

export default function ProductItem({
  badge,
  product_name,
  product_sale,
  product_price,
  product_image,
  product_id,
  product_quantity
}) {
  const router = useRouter();
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};

  return (
    <div className="product-item">
      <div
        className="position-relative bg-light overflow-hidden"
        onClick={() => router?.push(`/product/${product_id}`)}
        style={{width: '100%', height: '300px'}}
      >
        <Image
          src={product_image}
          alt={product_name}
          layout="responsive"
          width={50}
          height={50}
          placeholder="blur"
          blurDataURL={BLUR_BASE64}
        />
        {badge}
      </div>
      <div className="text-center p-4" style={{height: '120px', overflowY: 'hidden'}}>
        <a className="h5 mb-2 ellipse-text" href style={{height: '50px', overflowY: 'hidden'}}>
          {product_name}
        </a>
        {Number(product_sale) === Number(product_price) ||
        Number(product_sale) < 0 ? (
          <span className="text-primary me-1">
            {FORMAT_NUMBER?.format(product_price)} đ
          </span>
        ) : (
          <>
            <span className="text-primary me-1">
              {FORMAT_NUMBER?.format(product_sale)} đ
            </span>
            <span className="text-body text-decoration-line-through">
              {FORMAT_NUMBER?.format(product_price)} đ
            </span>
          </>
        )}
      </div>
      <div className="d-flex border-top">
        <small className="w-50 text-center border-end py-2">
          <a
            className="text-body"
            style={{ cursor: "pointer" }}
            onClick={() => router?.push(`/product/${product_id}`)}
          >
            <i className="fa fa-eye text-primary me-2" />
            Xem chi tiết
          </a>
        </small>
        <small className="w-50 text-center py-2">
          <a
            className="text-body"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (!userData?.user_id) {
                return toast.error(
                  "Bạn cần đăng nhập để thực hiện chức năng này"
                );
              }

              if (Number(product_quantity) < 1) {
                return toast.error(
                  "Số lượng lớn hơn số lượng sản phẩm hiện có"
                );
              }

              addProductToCart({
                product_id: product_id,
                product_name: product_name,
                product_price: product_price,
                product_sale: product_sale,
                product_image: product_image,
                quantity: 1,
              });
              toast.success("Thêm vào giỏ hàng thành công");
            }}
          >
            <i className="fa fa-shopping-bag text-primary me-2" />
            Thêm giỏ hàng
          </a>
        </small>
      </div>
    </div>
  );
}

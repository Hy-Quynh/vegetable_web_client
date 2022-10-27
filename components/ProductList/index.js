import React from "react";
import ProductItem from "../ProductItem";

export default function ProductList({ dataSource }) {
  return (
    <div className="row g-4">
      {dataSource?.map((item, index) => {
        return (
          <div
            className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
            data-wow-delay="0.1s"
            key={`product-item-${index}`}
          >
            <ProductItem
              badge={
                item?.promo?.length ? (
                  <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                    Khuyến mãi
                  </div>
                ) : (
                  false
                )
              }
              product_price={item?.product_price}
              product_sale={item?.product_sale}
              product_name={item?.product_name}
              product_image={item?.product_image}
              product_id={item?.product_id}
              product_quantity={item?.product_quantity}
            />
          </div>
        );
      })}
    </div>
  );
}

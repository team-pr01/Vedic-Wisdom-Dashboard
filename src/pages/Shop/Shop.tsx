import Products from "./Products";
import Vendors from "./Vendors";

const Shop = () => {
  return (
    <div className="flex flex-col gap-6">
      <Products />
      <Vendors />
    </div>
  );
};

export default Shop;
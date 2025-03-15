import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";
import ProductCarousel from "@/components/shared/product/product-carousel";
const Homepage = async () => {

  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return <div>
    { featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} /> }
    <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
  </div>;
}

export default Homepage;
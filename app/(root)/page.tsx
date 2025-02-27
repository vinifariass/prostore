import sampleData from "./db/sample-data";
import ProductList from "@/components/shared/product/product-list";
const Homepage = async () => {

  return <div><ProductList data={sampleData.products} title="Newest Arrivals" limit={4} /></div>;
}

export default Homepage;
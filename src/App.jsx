import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [priceCategory, setPriceCategory] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = data.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPrice = (() => {
        switch (priceCategory) {
          case "0-50":
            return product.price >= 0 && product.price <= 50;
          case "51-200":
            return product.price >= 51 && product.price <= 200;
          default:
            return true; 
        }
      })();

      return matchesSearch && matchesPrice;
    });

    setFilteredData(results);
  }, [search, data, priceCategory]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const noResults = filteredData.length === 0;

  return (
    <div>
      <div className="filter-container">
        <input
          className="input"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />

        <div className="price-filter">
          <label>
            Price Category
            <select
              value={priceCategory}
              onChange={(e) => setPriceCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="0-50">$0 - $50</option>

              <option value="51-200">$51 - $200</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid">
        {loading ? (
          <div>...Loading</div>
        ) : noResults ? (
          <div>No products found</div>
        ) : (
          filteredData.map((product) => (
            <div key={product.id} className="container">
              <img src={product.image} alt={product.title} className="image" />
              <h2>{product.title}</h2>
              <p>{product.description.slice(0, 100)}</p>
              <p>Price: ${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

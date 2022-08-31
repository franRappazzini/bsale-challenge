const { default: axios } = require("axios");

const URL = "http://localhost:3001";

async function getProducts() {
  const res = await axios.get(URL + "/product");

  res.data.forEach((prod) => {
    $(".products_container").append(`
        <article class='article_product'>
            <img src=${prod.url_image} alt=${prod.name} />
            <div>
                <h4>${prod.name}</h4>
                <h6>$${prod.price}</h6>
            </div>
        </article>
    `);
  });

  console.log(res.data);
}

getProducts();

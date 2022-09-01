const { default: axios } = require("axios");

$(() => {
  getProducts();
  getCategories();
});

const URL = "http://localhost:3001";

// TODO controlar errores de axios.get

async function getProducts(name, cat) {
  $(".products_container").empty();

  let query = "";
  if (name && cat) query = `?name=${name}&category=${cat}`;
  else if (name) query = `?name=${name}`;
  else if (cat) query = `?category=${cat}`;

  const res = await axios.get(URL + "/product" + query);
  console.log("res axios", res);

  if (res.response) return alert("error");
  else if (!res.data.length) return alert("No hubo coincidencias");

  res.data.forEach((prod) => {
    $(".products_container").append(`
      <article class="card my-2" style="width: 18rem;">
        <img src=${prod.url_image} class="card-img-top img_card" alt=${
      prod.name
    }>
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${prod.name}</h5>
          ${
            prod.discount
              ? `<p class="card-text text-decoration-line-through">
                  $${prod.price}
                </p>
                <div class="d-flex align-items-center">
                  <p class="card-text fs-5 fw-bolder me-2">
                    $${prod.price - (prod.discount * prod.price) / 100}
                  </p>
                  <p class="text-success">
                    ${prod.discount}% OFF
                  </p>
                </div>`
              : `<p class="card-text fs-5 fw-bolder">$${prod.price}</p>`
          }
          <div>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      <article/>
    `);
  });

  console.log(res.data);
}

async function getCategories() {
  const res = await axios.get(URL + "/category");

  if (res.response) return alert("error");

  res.data.map((cat) => {
    // $(".dropdown-menu").append(`
    //   <li class="dropdown-item item_category" id=${cat.id}>
    //     ${firstUpper(cat.name)}
    //   </li>
    // `);

    // $(`#${cat.id}`).click(() => {
    //   console.log($(`#${cat.id}`).attr("id"));
    //   const catId = $(`#${cat.id}`).attr("id");
    //   const name = $(".input_form").val().toUpperCase();
    //   getProducts(name, catId);
    // });

    $(".form-select").append(`
      <option value=${cat.id} id=${cat.id}>${firstUpper(cat.name)}</option>
    `);

    // $(`#${cat.id}`).click(() => console.log($(".form-select").val()));
  });
}

function firstUpper(str) {
  return str[0].toUpperCase() + str.slice(1);
}

// TODO agregarle la categoria
$(".form_search").submit((e) => {
  e.preventDefault();

  const inputValue = $(".input_form").val().toUpperCase();
  getProducts(inputValue);
});

$(".form-select").change(() => {
  console.log($(".form-select option").filter(":selected").val());
});

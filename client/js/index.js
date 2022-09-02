const { default: axios } = require("axios");

$(() => {
  getProducts();
  getCategories();
  handlers();
});

axios.defaults.baseURL =
  "https://challenge--bsale.herokuapp.com" || "http://localhost:3001";
// para paginado
let page = 1;
const prodPerPage = 12;

async function getProducts(name, cat, order) {
  $(".products_container, .spiner_container, .pagination_container").empty();
  $(".spiner_container").append(`
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `);

  // armo la query segun los params
  let query = "";
  if (name && cat && order)
    query = `?name=${name}&category=${cat}&order=${order}`;
  else if (name && cat) query = `?name=${name}&category=${cat}`;
  else if (name && order) query = `?name=${name}&order=${order}`;
  else if (order && cat) query = `?order=${order}&category=${cat}`;
  else if (name) query = `?name=${name}`;
  else if (cat) query = `?category=${cat}`;
  else if (order) query = `?order=${order}`;

  const res = await axios.get(`/product${query}`);
  // manejo de errores
  if (res.response) {
    $(".products_container, .spiner_container, .pagination_container").empty();
    return $(".spiner_container").append(`
      <section>
        <p class="text-center fs-4 mb-2">Lo sentimos..</p>
        <p class="text-center fs-5">Tuvimos un error de servidor, vuelva a intentarlo mas tarde.</p>
      </section>`);
  } else if (!res.data.length) {
    $(".products_container, .spiner_container, .pagination_container").empty();
    return $(".spiner_container").append(`
      <section>
        <p class="text-center fs-4 mb-2">Lo sentimos..</p>
        <p class="text-center fs-5">No hubo coincidencias con la busqueda, vuelva a intentarlo.</p>
      </section>`);
  }

  $(".products_container, .spiner_container, .pagination_container").empty();
  // renderizo los productos con paginacion
  const totalPage = Math.ceil(res.data.length / prodPerPage);
  res.data
    .slice((page - 1) * prodPerPage, (page - 1) * prodPerPage + prodPerPage)
    .forEach((prod) => {
      $(".products_container").append(`
        <article class="card" style="width: 16rem;">
          <div style="height: 16rem;">
            <img src=${prod.url_image} class="card-img-top img_card" 
              alt=${prod.name}>
          </div>
          <section class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title text-center">${prod.name}</h5>
            <div class="d-flex justify-content-between align-items-end">
              ${
                prod.discount
                  ? `
                    <div>
                      <p class="card-text text-decoration-line-through mb-2">
                        $${prod.price}
                      </p>
                      <div class="d-flex align-items-center">
                        <p class="card-text fs-5 fw-bolder me-2">
                          $${prod.price - (prod.discount * prod.price) / 100}
                        </p>
                        <p class="text-success">
                          ${prod.discount}% OFF
                        </p>
                      </div>
                    </div>
                  `
                  : `<p class="card-text fs-5 fw-bolder">
                      $${prod.price}
                    </p>`
              }
              <button class="btn btn-primary d-flex p-2 mb-3 align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart2" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                </svg>
              </button>
            </div>
          </section>
        <article/>`);
    });

  appendPagination(totalPage);
}

async function getCategories() {
  const res = await axios.get("/category");

  if (res.response) return console.log(res.response.data);

  // renderizo las categorias en el select del header
  res.data.forEach((cat) => {
    $(".select_category").append(`
      <option value=${cat.id}>${firstUpper(cat.name)}</option>
    `);
  });
}

function handlers() {
  $(".form_search").submit((e) => {
    e.preventDefault();
    filterProducts();
  });
  $(".select_category").change(() => filterProducts());
  $(".select_order").change(() => filterProducts());
}

function appendPagination(totalPage) {
  // btn previous
  $(".pagination_container").append(`
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <button class="page-link previous" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>    
      </ul>
    </nav>
  `);

  // por el totalPage creo un btn para la pagina y su handler
  for (let i = 1; i <= totalPage; i++) {
    $(".pagination").append(`
      <li class="page-item ${page === i && "active"}">
        <button class="page-link page_${i}">${i}</button>
      </li>
    `);

    $(`.page_${i}`).click(() => {
      if (page === parseInt($(`.page_${i}`).text())) return;
      page = parseInt($(`.page_${i}`).text());
      filterProducts();
    });
  }

  // btn next
  $(".pagination").append(`
    <li class="page-item">
      <button class="page-link next" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </button>
    </li>
  `);

  // handlers de previous y next
  $(".previous").click(() => {
    if (page === 1) return;
    page--;
    filterProducts();
  });
  $(".next").click(() => {
    if (page === totalPage) return;
    page++;
    filterProducts();
  });
}

function filterProducts() {
  page = 1;
  // obtengo los valores para hacer el get
  const inputValue = $(".input_form").val().toUpperCase();
  const selectValue = $(".select_category option").filter(":selected").val();
  const catId = selectValue === "Categorias" ? false : selectValue;
  const selectOrder = $(".select_order option").filter(":selected").val();
  const order = selectOrder === "Orden" ? false : selectOrder;
  getProducts(inputValue, catId, order);
}

function firstUpper(str) {
  return str[0].toUpperCase() + str.slice(1);
}

const storeUrl = "https://mock.shop/api?query={products(first:8){edges{node{id+title+description+featuredImage{url}+variants(first:1){edges{node{price{amount}}}}}}}}"

async function fetchProducts() {
  const request = await fetch(storeUrl);
  let response = await request.json();
  return response.data.products.edges;
};

// MARK: Home

async function loadProducts() {
  try {
    const container = document.getElementById("products-container");

    let products = await fetchProducts()
    
    products.forEach(product => {
      let aarr = product.node.id.split('/');
      let productId = aarr[aarr.length -1];

      localStorage.setItem(productId, JSON.stringify(product.node));

      const preview = createProductPreview(product.node, productId);
      const productContainer = document.createElement("div");
      productContainer.className = "col-md-3 mb-5"
      productContainer.innerHTML = preview;

      container.appendChild(productContainer)
    });
  } catch(error) {
    console.log("Error:", error)
  }
}

function createProductPreview(product, id) {
  let title = product.title
  let description = product.description
  let imgUrl = product.featuredImage.url
  let price = `$${product.variants.edges[0].node.price.amount}0`

  let preview = `
    <a href="product.html?product=${id}" style="text-decoration:none">
      <div class="card">  
        <img class="card-img-top" src="${imgUrl}"/>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${price}</p>
        </div>
      </div>  
    </a>
  `

  return preview;
}

// MARK: Product

function loadProductDetail() {
  var aarr = window.location.href.split('product=');
  //get last value
  var id = aarr[aarr.length -1];
  let productString = localStorage.getItem(id)
  let product = JSON.parse(productString)

  let detail = createProductDetail(product);

  const container = document.getElementById("product-detail");

  const productContainer = document.createElement("div");
  productContainer.innerHTML = detail;
  container.appendChild(productContainer)
}

function createProductDetail(product) {
  let title = product.title
  let description = product.description
  let imgUrl = product.featuredImage.url
  let price = `$${product.variants.edges[0].node.price.amount}0`

  let detail = `
    <div class="row">
      <div class="col-md-6">
        <img class="img-fluid" src="${imgUrl}">
      </div>
      <div class="col-md-6">
        <h1 class="display-4">${title}</h1>
        <p>${description}</p>
        <div class="row mt-5">
          <div class="col">
            <h4>${price}</h4>
          </div>
          <div class="col d-flex justify-content-end">
            <button class="btn btn-dark" id="liveAlertBtn" type="button">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  `

  return detail;
}

function setupAlert(){
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible" role="alert">
        <div>${message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `

    alertPlaceholder.append(wrapper)
  }

  const alertTrigger = document.getElementById('liveAlertBtn')
  if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
      appendAlert('Item added to cart!', 'success')
    })
  } else {
    console.log("Error: Cannot get liveAlertBtn element")
  }
}
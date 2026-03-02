const searchInput = document.querySelector("[data-search-input]");
const searchSubmit = document.querySelector("[data-search-submit]");
const suggestionButtons = document.querySelectorAll(".search-suggestions button");
const resultsWrapper = document.querySelector("[data-search-results]");
const resultsGrid = resultsWrapper?.querySelector(".search-results-grid");
const resultsHeader = resultsWrapper?.querySelector(".search-results-header h3");
const resultsCount = resultsWrapper?.querySelector(".search-results-header span");
const emptyState = resultsWrapper?.querySelector("[data-search-empty]");
const searchRoomSelect = document.querySelector("#search-room");
const searchStyleSelect = document.querySelector("#search-style");
const searchColorSelect = document.querySelector("#search-color");
const searchBudget = document.querySelector("#search-budget");
const searchBudgetValue = document.querySelector(".search-range-value");
const searchToggles = document.querySelectorAll(".search-toggle");
const searchClear = document.querySelector(".search-clear");
const searchScope =
  document.querySelector("[data-search-scope]")?.dataset.searchScope ||
  document.querySelector(".search-panel")?.dataset.searchScope ||
  "index";

const CART_KEY = "corrie:cart";
const AUTH_KEY = "corrie:auth";
const USERS_KEY = "corrie:users";
const CURRENT_USER_KEY = "corrie:currentUser";
const GOOGLE_CLIENT_ID = "157685675631-n5m3sp317mhtt74jnf6m3up1fin06oag.apps.googleusercontent.com";

const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const mobileDrawer = document.querySelector("[data-mobile-drawer]");
const drawerBackdrop = document.querySelector("[data-drawer-backdrop]");

const filterToggle = document.querySelector("[data-filter-toggle]");
const filterClose = document.querySelector("[data-filter-close]");
const filterPanel = document.querySelector("[data-filter-panel]");
const filterApply = document.querySelector("[data-filter-apply]");
const filterClear = document.querySelector("[data-filter-clear]");
const filterCount = document.querySelector("[data-filter-count]");
const filterGrid = document.querySelector("[data-filter-grid]");
const filterInputs = filterPanel ? filterPanel.querySelectorAll("input[data-filter]") : [];

const buildProductUrl = (name, priceText) => {
  const price = priceText ? priceText.split("·")[0].trim() : "";
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (price) params.set("price", price);
  return `product.html?${params.toString()}`;
};

const persistProductSelection = (name, price) => {
  try {
    if (name) localStorage.setItem("corrie:lastProductName", name);
    if (price) localStorage.setItem("corrie:lastProductPrice", price);
  } catch (err) {
    // ignore storage failures
  }
};

const wireProductCardsToView = () => {
  if (!document.body) return;
  const isProductPage = window.location.pathname.toLowerCase().endsWith("product.html");
  if (isProductPage) return;

  const cards = document.querySelectorAll(".product-grid article");
  cards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      const name = card.querySelector("h4")?.textContent?.trim();
      const priceText = card.querySelector(".product-meta p")?.textContent?.trim();
      const price = priceText ? priceText.split("·")[0].trim() : "";
      if (!name) return;
      persistProductSelection(name, price);
      window.location.href = buildProductUrl(name, priceText);
    });
  });
};

const applyProductViewFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  let name = params.get("name");
  let price = params.get("price");
  const fallbackPrices = {
    "Glass Globe Lamp": "$61",
  };

  if (!name || !price) {
    try {
      name = name || localStorage.getItem("corrie:lastProductName");
      price = price || localStorage.getItem("corrie:lastProductPrice");
    } catch (err) {
      // ignore storage failures
    }
  }

  if (!price && name && fallbackPrices[name]) {
    price = fallbackPrices[name];
  }

  if (!name && !price) return;

  const eyebrow = document.querySelector(".product-hero .eyebrow");
  const title = document.querySelector("title");
  const priceNode = document.querySelector(".price-row h2");

  if (eyebrow && name) eyebrow.textContent = name;
  if (title && name) title.textContent = `CORRIESELLS | ${name}`;
  if (priceNode && price) priceNode.textContent = price;
};

const productImages = {
  "Marin Modular Sofa": "https://i.pinimg.com/736x/16/05/e8/1605e89e703d8d1dfb7297ba7c79b874.jpg",
  "Living Room": "https://i.pinimg.com/736x/f7/31/df/f731df9c98d50b01a90691ce5f037ea0.jpg",
  "Bedroom": "https://i.pinimg.com/1200x/7d/92/97/7d929794f5f7a08d2d2b95276b707529.jpg",
  "Patio": "https://i.pinimg.com/736x/31/a1/9a/31a19a89cececd10966efeb9b463bd40.jpg",
  "Office": "https://i.pinimg.com/736x/72/f4/77/72f47703f29cd7fb899016a7c1055b94.jpg",
  "Kitchen": "https://i.pinimg.com/736x/95/b4/57/95b4577ddbcc0e8215a3d3c78d0fa1fb.jpg",
  "Walnut Cutting Board": "https://i.pinimg.com/1200x/c3/46/c5/c346c5c30df9481850ae12a390a8814a.jpg",
  "Brushed Oak Sideboard": "https://i.pinimg.com/1200x/26/ef/50/26ef50e806948bd130a44211ad95683e.jpg",
  "Carbon Steel Skillet": "https://i.pinimg.com/736x/bf/fb/04/bffb04558156ec26e7dc18c78c872385.jpg",
  "Ceramic Dinner Set": "https://i.pinimg.com/1200x/38/d7/bc/38d7bc503ec87a10368846798b8a7de5.jpg",
  "French Press Kit": "https://i.pinimg.com/736x/82/bd/ae/82bdaef8dd9eb9533e6bde5a0d894c9f.jpg",
  "Nonstick Saucepan": "https://i.pinimg.com/736x/53/a9/25/53a925d32d303f3772aaf972bc1fe8a1.jpg",
  "Cast Iron Dutch Oven": "https://i.pinimg.com/1200x/24/91/7b/24917b3cd0654440d7a79df22a43644d.jpg",
  "Stoneware Mixing Bowl": "https://i.pinimg.com/1200x/b8/a5/dd/b8a5ddea04447d1d4be5dbff310b9889.jpg",
  "Tea Kettle": "https://i.pinimg.com/736x/1f/fb/99/1ffb99a78be99405301412704219eded.jpg",
  "Silicone Spatula Set": "https://i.pinimg.com/1200x/49/d1/69/49d16937d3b385bde8a09f601b0926a3.jpg",
  "Bamboo Prep Board": "https://i.pinimg.com/736x/cb/cd/4e/cbcd4ec492cf64fc6d5454917824b463.jpg",
  "Stainless Colander": "https://i.pinimg.com/1200x/f8/25/a0/f825a0a80f1a94fd477d0ff8cc055838.jpg",
  "Measuring Cup Set": "https://i.pinimg.com/1200x/f3/ee/33/f3ee333a73a2eeb131399e194605f218.jpg",
  "Magnetic Knife Strip": "https://i.pinimg.com/1200x/a8/18/59/a81859a6268529d54d39ddbd638f5b39.jpg",
  "Pantry Canister Set": "https://i.pinimg.com/1200x/b7/28/d7/b728d7863486df0ee4d0923fa8e3bc10.jpg",
  "Rattan Bar Stool": "https://i.pinimg.com/736x/2d/92/00/2d9200ed55d42da5c07cea88ee4ff494.jpg",
  "Round Bistro Table": "https://i.pinimg.com/736x/85/d4/f0/85d4f0db75149b00a31a89ec9757223f.jpg",
  "Linen Napkin Set": "https://i.pinimg.com/736x/52/3c/53/523c53f2bca64b9393888467bba99601.jpg",
  "Low Profile Bench": "https://i.pinimg.com/736x/26/cf/ff/26cfff7f38439260edb5043fc9c5bd3a.jpg",
  "Porcelain Salad Bowl": "https://i.pinimg.com/736x/80/d8/ad/80d8ad968d0534b9df62dd7896e61709.jpg",
  "Glass Stemware Set": "https://i.pinimg.com/736x/5e/7a/3c/5e7a3cc15dde80504777039908faf295.jpg",
  "Wooden Lazy Susan": "https://i.pinimg.com/736x/08/b0/cf/08b0cf6086d306f35d4713b4a658ef7e.jpg",
  "Ceramic Pitcher": "https://i.pinimg.com/736x/53/1a/fd/531afdfefdfbce6de6601a11815b13f0.jpg",
  "Napkin Ring Set": "https://i.pinimg.com/736x/e4/88/cf/e488cf7a72170b35176e587d10c3d53d.jpg",
  "Marble Serving Board": "https://i.pinimg.com/736x/99/b5/a8/99b5a8e062ff6a62f08fcfc30e87df50.jpg",
  "Candlelight Centerpiece": "https://i.pinimg.com/736x/13/7d/d0/137dd02777622c8347e1886f72441835.jpg",
  "Woven Placemats": "https://i.pinimg.com/736x/63/86/f5/6386f569c4f1441e61565dcebfb09df9.jpg",
  "Dining Chair Cushion": "https://i.pinimg.com/736x/c2/67/23/c267230444c1dd18073b9ce780e73401.jpg",
  "Oak Sideboard": "https://i.pinimg.com/736x/b9/d8/36/b9d836848bd413f7e338e59e5466890e.jpg",
  "Stoneware Mug Set": "https://i.pinimg.com/736x/94/f7/ef/94f7efd79b08f18ed5d3f0376a09cf5f.jpg",
  "Brass Cutlery Set": "https://i.pinimg.com/736x/04/fb/d3/04fbd367583c5c6fac4c1d7361f1ede6.jpg",
  "Bath Mat Set": "https://i.pinimg.com/1200x/e3/66/58/e36658ed6cd55c48d9c0021382496430.jpg",
  "Teak Shower Bench": "https://i.pinimg.com/736x/f2/64/30/f26430ebbffda3ce900bbc6bb18d9164.jpg",
  "Soft Glow Floor Lamp": "https://i.pinimg.com/1200x/d9/f6/5c/d9f65caa9d43618f27593a6cd1473ae4.jpg",
  "Ribbed Cotton Towels": "https://i.pinimg.com/736x/aa/58/25/aa5825e225c3e06f91ba623044da7a53.jpg",
  "Cloudy Boucle Sofa": "https://i.pinimg.com/736x/60/99/21/609921f8757b0f39517de24513be9a9e.jpg",
  "": "",
  "": "",
  "": "",
  "Kitchen in Balance": "https://i.pinimg.com/736x/44/98/a8/4498a8705c814b56ec3f86f314624ec8.jpg",
  "Calm Bath Refresh": "https://i.pinimg.com/736x/c1/55/9f/c1559f6d252a5789eaaa6ec97c12641f.jpg",
  "Dining in Soft Oak": "https://i.pinimg.com/736x/46/05/bc/4605bc928aacf5e5426e7877a6109c14.jpg",
  "Warm Minimal Living": "https://i.pinimg.com/736x/8c/21/44/8c214408120d380b0b5435a6ff67d7ab.jpg",
  "Rolling Bin": "https://i.pinimg.com/736x/30/2a/7b/302a7bb9a98c6a5a9ce0ed7e2e98ee12.jpg",
  "Sideboard Cabinet": "https://i.pinimg.com/736x/b0/a3/dc/b0a3dc76ea7e385eb32c6bdfe400428c.jpg",
  "Drawer Divider Set": "https://i.pinimg.com/736x/e3/09/95/e30995d2e822954ea192b1266fa5ca7b.jpg",
  "Pantry Rack": "https://i.pinimg.com/1200x/99/e4/e1/99e4e141862e49dbf5f2298b9856991e.jpg",
  "Closet Organizer": "https://i.pinimg.com/1200x/30/e7/f0/30e7f0cef4b2b6b13ec84bcc8f046273.jpg",
  "Storage Bench": "https://i.pinimg.com/736x/be/1c/fb/be1cfb42102b737227c7c773b5afb71e.jpg",
  "Utility Cart": "https://i.pinimg.com/736x/5a/50/ec/5a50ecc563d9db716ad8bb1187f20934.jpg",
  "Coat Stand": "https://i.pinimg.com/736x/47/0b/e1/470be1febd07652006fb7fef34a98a64.jpg",
  "Shoe Rack": "https://i.pinimg.com/1200x/b1/02/57/b102577839eac1350fdfa4e48c59d731.jpg",
  "Storage Ottoman": "https://i.pinimg.com/736x/69/77/ea/6977ea2247ee92b2e0db5cae961cd8d0.jpg",
  "Media Console": "https://i.pinimg.com/736x/03/ca/e6/03cae6487ebf8f9c315d8e8ab5063efe.jpg",
  "Low profile media console": "https://i.pinimg.com/736x/03/ca/e6/03cae6487ebf8f9c315d8e8ab5063efe.jpg",
  "Glass Front Cabinet": "https://i.pinimg.com/736x/4e/de/9b/4ede9b39852b62c3461ccfc2b734963d.jpg",
  "Stacked Cubes": "https://i.pinimg.com/736x/60/7c/11/607c114ccb67be833805b18a3bf75438.jpg",
  "Underbed Storage": "https://i.pinimg.com/736x/67/bf/67/67bf675d7818052867120bcbbf79eb65.jpg",
  "Entryway Cabinet": "https://i.pinimg.com/736x/75/2a/29/752a29013cc20277223756d818517ab1.jpg",
  "Wall Shelf Ladder": "https://i.pinimg.com/736x/11/b0/d1/11b0d1fde4ac8c159e065a8d54f5f2bd.jpg",
  "Woven Basket Set": "https://i.pinimg.com/736x/65/85/d6/6585d63f0df34489f1e441cd9aaf9da8.jpg",
  "Storage Console": "https://i.pinimg.com/736x/b0/c4/31/b0c4316641a3cf7f08f70b1cea5eed89.jpg",
  "Modular Bookcase": "https://i.pinimg.com/736x/f8/5f/d6/f85fd6d3ac180c3f4227baee736d8239.jpg",
  "Accent Night Light": "https://i.pinimg.com/736x/15/eb/92/15eb92e1f45d1923de62317c6fb8a3ec.jpg",
  "Frosted Globe Pendant": "https://i.pinimg.com/736x/b3/bf/68/b3bf68de7010ae6da93ccbdfe4039a92.jpg",
  "Marble Base Lamp": "https://i.pinimg.com/736x/a4/64/d6/a464d6b81759e217e0730dd041672e27.jpg",
  "Shade Floor Lamp": "https://i.pinimg.com/736x/90/3a/a0/903aa093009ac6e32d89a4f9de1f2c62.jpg",
  "Linear Pendant": "https://i.pinimg.com/736x/4f/3d/71/4f3d71cd978f340402759a3dc5ff8b00.jpg",
  "Outdoor Wall Light": "https://i.pinimg.com/736x/cd/74/92/cd749228b316e34f7dd3a3081aed832c.jpg",
  "Dimmer Switch Kit": "https://i.pinimg.com/736x/c6/98/82/c6988277c8bb5436a6c0edf69292e37b.jpg",
  "Battery Accent Lamp": "https://i.pinimg.com/736x/9c/96/3b/9c963b630c83604a7d122df6cd92c02a.jpg",
  "Bedroom Sconce": "https://i.pinimg.com/736x/fe/66/b7/fe66b775df0ef892e33dc1f2b95cba99.jpg",
  "Minimal Chandelier": "https://i.pinimg.com/736x/1b/3e/cf/1b3ecfcdaab413535b602215c60ec688.jpg",
  "Pendant Trio": "https://i.pinimg.com/736x/16/52/27/165227c17f67f95b546e050ecd267e6c.jpg",
  "Soft Glow Lantern": "https://i.pinimg.com/1200x/04/84/c0/0484c09966ba42fe07ffe95c92d61a91.jpg",
  "Brass Desk Lamp": "https://i.pinimg.com/736x/81/76/80/8176801b09035da7d3286db4dc744fb8.jpg",
  "Reading Lamp": "https://i.pinimg.com/1200x/b0/e3/56/b0e356ada41c3ce229468354bafa75b3.jpg",
  "LED Strip Light": "https://i.pinimg.com/736x/f4/04/9f/f4049fab12e2e1055e853c3d0fd3b906.jpg",
  "Wall Sconce Pair": "https://i.pinimg.com/736x/c0/f6/32/c0f632419e8a4016677a7d72e257f6df.jpg",
  "Ceramic Table Lamp": "https://i.pinimg.com/736x/ea/c6/50/eac650118629730a44dfc2cd3cc3f104.jpg",
  "Glass Globe Lamp": "https://i.pinimg.com/736x/25/e5/7a/25e57a03f8ef8cb341564acf1aba4082.jpg",
  "Matte Pendant Light": "https://i.pinimg.com/736x/d0/1a/9e/d01a9ed4f7d3349e4a82b1bc5f65c87e.jpg",
  "Arc Floor Lamp": "https://i.pinimg.com/736x/74/b6/e3/74b6e3eb8472c56b015d712ad69a5114.jpg",
  "Office Rug": "https://i.pinimg.com/736x/49/0a/58/490a58f72b4b975a8a711a1c09a0914a.jpg",
  "Pinboard": "https://i.pinimg.com/736x/d5/7d/1d/d57d1d8d8632dc0527c70f07a06580a7.jpg",
  "Storage Cubby": "https://i.pinimg.com/736x/c4/ca/00/c4ca00c2645076f2648a141f2f396797.jpg",
  "Laptop Stand": "https://i.pinimg.com/736x/7a/bc/8d/7abc8d551ebb81dec1a47c609fd04ae0.jpg",
  "Floating Shelf Set": "https://i.pinimg.com/736x/14/86/e3/1486e394a0fe41ff4540820af7a75a6f.jpg",
  "Soft Desk Chair": "https://i.pinimg.com/736x/d4/f7/60/d4f760348bbaf2db9f88d6d16ce37aa5.jpg",
  "Corner Desk": "https://i.pinimg.com/736x/8b/94/16/8b9416c7e94f5902630519fcdb57fc0a.jpg",
  "Task Stool": "https://i.pinimg.com/736x/ba/74/99/ba74995315f760924284f885ada36b28.jpg",
  "Wireless Charging Dock": "https://i.pinimg.com/736x/ed/48/a9/ed48a9b313362b3de44b40fac38a486d.jpg",
  "Rolling Storage Cart": "https://i.pinimg.com/736x/1f/df/cf/1fdfcfd4678b3b1e3baf3644c3b6810d.jpg",
  "Monitor Stand": "https://i.pinimg.com/736x/e8/bc/fa/e8bcfa7cea5acfba9d350ed0d060db64.jpg",
  "Felt Desk Pad": "https://i.pinimg.com/736x/45/3d/fb/453dfbff432369e17c4e01a5a2b5d92f.jpg",
  "Compact Bookcase": "https://i.pinimg.com/736x/30/a2/59/30a259c91daad84be54b7f9ffc487084.jpg",
  "Wood Desk Organizer": "https://i.pinimg.com/736x/0f/82/7e/0f827ec91186faf1448f574ef5ebc7b9.jpg",
  "Minimal File Cabinet": "https://i.pinimg.com/1200x/4b/aa/95/4baa95c924978df5047f3d1df0ffc1b6.jpg",
  "Cable Organizer": "https://i.pinimg.com/736x/17/06/44/170644ccf8ee4ae207be12038e170536.jpg",
  "Desk Lamp": "https://i.pinimg.com/736x/e9/2e/eb/e92eebff0a1d08aae67e01a58a4a22a5.jpg",
  "Wall Mounted Shelf": "https://i.pinimg.com/736x/b4/e6/2c/b4e62cd70888222abd0f3cac94fd2ca7.jpg",
  "Ergonomic Task Chair": "https://i.pinimg.com/1200x/94/2b/e4/942be488c7bff4e9c7c59f97e0ba03cd.jpg",
  "Standing Desk": "https://i.pinimg.com/1200x/91/5e/3f/915e3f0e2404136bb554ad40b3a1a31d.jpg",
  "Cement Planter": "https://i.pinimg.com/736x/53/a8/81/53a881520aa8fe06f27c8afe8522fa62.jpg",
  "Sun Shade Sail": "https://i.pinimg.com/736x/4e/18/39/4e1839efbb8961499ecaf771af5da18d.jpg",
  "Outdoor Ottoman": "https://i.pinimg.com/736x/58/f5/dc/58f5dc8f3e295d0fffb9d030ed203733.jpg",
  "Deck Chair": "https://i.pinimg.com/736x/d3/57/cb/d357cb36321d9725ec29c2e2964f4684.jpg",
  "Patio Storage Box": "https://i.pinimg.com/1200x/f9/20/73/f92073892ae0cf30be64cafdd2216d13.jpg",
  "Outdoor Bar Cart": "https://i.pinimg.com/736x/a8/9b/8e/a89b8e1ba854cbc87b153a285a53f954.jpg",
  "All-Weather Cushion Set": "https://i.pinimg.com/736x/e8/47/66/e847666840143115c19ccdc80fe5ba7a.jpg",
  "Fire Pit Bowl": "https://i.pinimg.com/736x/f7/c0/3e/f7c03e2be8ab5b5b88c90492d168559b.jpg",
  "Outdoor Bench": "https://i.pinimg.com/736x/75/39/78/753978a14e792aeb9d2dffb0f843fbd6.jpg",
  "Hammock Chair": "https://i.pinimg.com/736x/7d/e1/e8/7de1e8f9af041b9911eab05c49270d46.jpg",
  "String Light Kit": "https://i.pinimg.com/1200x/12/5b/f5/125bf5a05bfbfb293e4884bd81399543.jpg",
  "Garden Lantern": "https://i.pinimg.com/736x/45/43/c0/4543c0ced2c8bf9afdea2a048f2a65ff.jpg",
  "Planter Set": "https://i.pinimg.com/736x/45/07/17/450717078b65eb6fe5fa2103ad4e9dbb.jpg",
  "Teak Side Table": "https://i.pinimg.com/736x/25/7b/4d/257b4dcc4132208ff896518064dd58e0.jpg",
  "Umbrella Shade": "https://i.pinimg.com/1200x/24/24/ef/2424ef2c98b1fae4bf3fb91838dd28e5.jpg",
  "Outdoor Rug": "https://i.pinimg.com/736x/4e/3d/36/4e3d368525307cccf52a4e2ec820e835.jpg",
  "Bistro Chair Pair": "https://i.pinimg.com/1200x/23/c1/c2/23c1c2a27092cb2a3457d207a2ab84fc.jpg",
  "Weatherproof Sofa": "https://i.pinimg.com/736x/3b/ad/88/3bad881dbfb35eea176683d0c02c98bd.jpg",
  "Outdoor Dining Table": "https://i.pinimg.com/1200x/4b/95/7d/4b957de8ee59d3e0c3a20d441262062a.jpg",
  "Patio Lounge Set": "https://i.pinimg.com/1200x/79/00/0a/79000a8611b971afda221d7c07f073a0.jpg",
  "Soft Light Sconce": "https://i.pinimg.com/736x/44/71/a5/4471a510f8f38bfeacde2503766ce6c0.jpg",
  "Minimal Waste Bin": "https://i.pinimg.com/736x/c7/1b/68/c71b68cc5d8aecdaace464f7eec28120.jpg",
  "Bathroom Caddy": "https://i.pinimg.com/1200x/72/d2/2a/72d22adc9b0e3559a6e4b9111e37c4fc.jpg",
  "Matte Soap Tray": "https://i.pinimg.com/1200x/c4/71/87/c4718728b822a4a2d21a161b4bf748a0.jpg",
  "Aroma Diffuser": "https://i.pinimg.com/736x/bb/81/f8/bb81f82d442cc8626f04066a69a822f8.jpg",
  "Countertop Organizer": "https://i.pinimg.com/1200x/ee/ee/c8/eeeec87ac72cde2c3938a592e85c52cd.jpg",
  "Soft Bath Rug": "https://i.pinimg.com/1200x/ed/a2/3d/eda23d7a0e77193d5e6336b196ca309b.jpg",
  "Metal Towel Ladder": "https://i.pinimg.com/1200x/29/d0/8f/29d08f7ecb433912bced1ad27efef3dc.jpg",
  "Spa Tray": "https://i.pinimg.com/1200x/5a/17/83/5a1783bad2bd7991caeb758362b94874.jpg",
  "Jade R. · Verified buyer": "https://i.pinimg.com/736x/22/b2/15/22b215706a79411b74e2d323a92bfc88.jpg",
  "Casey T. · Verified buyer": "https://i.pinimg.com/1200x/7d/8c/80/7d8c80ec188a3315854f3d7c789cb70f.jpg",
  "Marcus L. · Verified buyer": "https://i.pinimg.com/736x/aa/f0/a7/aaf0a732d14360e190576b7ffb8d3993.jpg",
  "Sunset Woven Rug": "https://i.pinimg.com/736x/48/2b/9e/482b9edf78111646128fc21a50d1fe4f.jpg",
  "Matte Clay Lamp": "https://i.pinimg.com/1200x/02/0e/23/020e232fee8734274b2b9838dec26f9b.jpg",
  "Nova Dining Set": "https://i.pinimg.com/736x/88/29/03/882903bd240c99a581ef12fa6a63e7d3.jpg",
  "Rowan Accent Chair": "https://i.pinimg.com/1200x/d5/85/e1/d585e13b96facf37e7939d35fb169ca9.jpg",
  "Utensil Starter Kit": "https://i.pinimg.com/736x/a7/ba/39/a7ba39a5c208c309e4dc4afb5856b1a9.jpg",
  "Chef Knife Set": "https://i.pinimg.com/736x/23/8f/22/238f229bc6cdf9e23cb20ac66d0a53f3.jpg",
  "Carbon Steel Pan": "https://i.pinimg.com/1200x/f6/70/34/f670341fb866f33e83b9a63634231884.jpg",
  "Matte Utensil Set": "https://i.pinimg.com/1200x/1a/df/87/1adf87e0c1189e2da46b3b415ca7fa70.jpg",
  "Matte utensil set": "https://i.pinimg.com/1200x/1a/df/87/1adf87e0c1189e2da46b3b415ca7fa70.jpg",
  "Glass Storage Trio": "https://i.pinimg.com/1200x/c2/29/b9/c229b97da2d0160c81ab91ec070f040a.jpg",
  "Espresso Compact Machine": "https://i.pinimg.com/1200x/a4/c0/27/a4c027856dd1f9ae3de22d3324d40bd0.jpg",
  "Quiet Blender Pro": "https://i.pinimg.com/736x/3b/36/9c/3b369c97cb36dbd045ebb0518e5b630d.jpg",
  "Smart Toaster Oven": "https://i.pinimg.com/1200x/5d/4a/aa/5d4aaab6560becdfd4df013f13e7618b.jpg",
  "Stainless Steel Cookware Set": "https://i.pinimg.com/1200x/22/02/f4/2202f40f89a788f4cc83931f5b9b289c.jpg",
  "Oak Dining Table": "https://i.pinimg.com/736x/d4/06/f3/d406f3e2bff6d9e5856a12e02fa29833.jpg",
  "Canvas Dining Chair": "https://i.pinimg.com/736x/f6/85/f4/f685f40eee1483f5da87020b8966e48d.jpg",
  "Stoneware Serve Set": "https://i.pinimg.com/736x/fb/d2/c1/fbd2c1fc90dbc30ce9cb4fc33f8fe00c.jpg",
  "Textured Table Runner": "https://i.pinimg.com/736x/96/8c/06/968c0625c08a6ae23cf19bd5fcaa42a3.jpg",
  "Oak Vanity Storage": "https://i.pinimg.com/736x/05/bf/2b/05bf2b76940e01d9f0c04f67bf121db6.jpg",
  "Waffle Towel Set": "https://i.pinimg.com/1200x/bc/8c/b8/bc8cb800ab0057822209974c294a7ca1.jpg",
  "Stone Soap Dispenser": "https://i.pinimg.com/736x/ec/35/3e/ec353ead71264b287b2da16f78833186.jpg",
  "Rounded Bath Mirror": "https://i.pinimg.com/1200x/92/b9/f9/92b9f9efaa2bee9f92bb5abd52d5a656.jpg",
  "Stoneware Dinner Set": "https://i.pinimg.com/1200x/25/af/6c/25af6c05270f339315c75b9571bdde62.jpg",
  "Marble Rolling Pin": "https://i.pinimg.com/1200x/06/f1/c8/06f1c88a7859add6274b3a158e7f052a.jpg",
  "Olive Wood Salad Set": "https://i.pinimg.com/736x/92/dc/23/92dc23e1d8049807a6ccf39c727a25d4.jpg",
  "Ceramic Knife Set": "https://i.pinimg.com/736x/38/be/3c/38be3ce796c5036adc9d27d4ad338a88.jpg",
  "Smart Fridge": "https://i.pinimg.com/736x/b6/e5/73/b6e573d48361598560ccc37be148bff4.jpg",
  "Haze Linen Drapes": "https://i.pinimg.com/736x/66/58/f9/6658f9a6674055ec842ac97b39065444.jpg",
  "Amber Linen Throw": "https://i.pinimg.com/736x/bd/8c/38/bd8c382858f9e86ebbcdfe835c8cc660.jpg",
  "Amber linen throw": "https://i.pinimg.com/736x/bd/8c/38/bd8c382858f9e86ebbcdfe835c8cc660.jpg",
  "Stonewashed Coffee Table": "https://i.pinimg.com/736x/ec/1a/4e/ec1a4e35f6ef586afeaedb620e0ff92b.jpg",
  "Stonewashed coffee table": "https://i.pinimg.com/736x/ec/1a/4e/ec1a4e35f6ef586afeaedb620e0ff92b.jpg",
  "Linen Bathrobe": "https://i.pinimg.com/736x/f9/02/3e/f9023eeac369500810f663866998e10b.jpg",
  "Ceramic Toothbrush Holder": "https://i.pinimg.com/736x/f3/0c/b6/f30cb6d57e7980fafa1e745d272ba07a.jpg",
  "Wall Shelf Trio": "https://i.pinimg.com/1200x/bf/4e/03/bf4e0365fab410dcd1d803f4ab40f6fe.jpg",
  "Glass Canister Set": "https://i.pinimg.com/736x/c7/97/28/c7972803348c95552e494f251838d961.jpg",
};

wireProductCardsToView();
applyProductViewFromQuery();

const productGalleryImages = {
  "Bath Mat Set": [
    "https://i.pinimg.com/1200x/3b/e8/da/3be8dadb46a87d0274e5355134c7ccc6.jpg",
    "https://i.pinimg.com/1200x/e3/66/58/e36658ed6cd55c48d9c0021382496430.jpg",
    "https://i.pinimg.com/1200x/cd/70/53/cd7053cb69c97bebbeb7387903c89980.jpg",
  ],
  "Kitchen in Balance": [
    "https://i.pinimg.com/736x/44/98/a8/4498a8705c814b56ec3f86f314624ec8.jpg",
    "https://i.pinimg.com/1200x/06/d0/8a/06d08a0ebbf32d893255f2aca1f122fc.jpg",
    "https://i.pinimg.com/736x/a7/54/05/a75405222e773298f166036e8801dd4e.jpg",
    "https://i.pinimg.com/736x/a8/06/13/a80613c893f8ce6791c4c7c3ad2b9dfa.jpg"
  ],
  "Calm Bath Refresh": [
    "https://i.pinimg.com/736x/c1/55/9f/c1559f6d252a5789eaaa6ec97c12641f.jpg",
    "https://i.pinimg.com/1200x/cd/03/e3/cd03e335869a78d1dc2695b6a3addca1.jpg",
    "https://i.pinimg.com/736x/85/9a/7e/859a7e8d6bb10febd736779d9d34f362.jpg",
    "https://i.pinimg.com/736x/42/a4/6d/42a46dd4f3c64af3770bdcb0e76eea2a.jpg"
  ],
  "Dining in Soft Oak": [
    "https://i.pinimg.com/736x/46/05/bc/4605bc928aacf5e5426e7877a6109c14.jpg",
    "https://i.pinimg.com/736x/c6/c1/2f/c6c12fc77053f0694cde373878f9c951.jpg",
    "https://i.pinimg.com/1200x/06/ed/d1/06edd102b591999ba5fca93f880fccc6.jpg",
    "https://i.pinimg.com/736x/a4/b9/5f/a4b95f8db83e664ea92a15131b7a649a.jpg"
  ],
  "Warm Minimal Living": [
  "https://i.pinimg.com/736x/8c/21/44/8c214408120d380b0b5435a6ff67d7ab.jpg",
  "https://i.pinimg.com/736x/b8/ca/31/b8ca311dc27b47a9d93a65897dc4fef1.jpg",
  "https://i.pinimg.com/736x/3d/60/46/3d60463c2ca1ded8e6e14dcb4bdf5d03.jpg",
  "https://i.pinimg.com/736x/47/6b/e5/476be536769e38a5db89ae057288e448.jpg"
],
  "Teak Side Table": [ 
   "https://i.pinimg.com/736x/25/7b/4d/257b4dcc4132208ff896518064dd58e0.jpg",
   "https://i.pinimg.com/736x/51/ce/02/51ce02597b1ce1e7e6101007095aa863.jpg",
   "https://i.pinimg.com/736x/0a/48/1e/0a481e726bc5b3a238f4a671513adeaa.jpg",
   "https://i.pinimg.com/736x/e4/b1/6c/e4b16cb93ba9c5e407a127b46f31a26f.jpg"
  ],
  "Outdoor Rug": [
    "https://i.pinimg.com/736x/4e/3d/36/4e3d368525307cccf52a4e2ec820e835.jpg",
    "https://i.pinimg.com/736x/54/e7/08/54e708e87bf148be51c8afe7f7d2b738.jpg",
    "https://i.pinimg.com/736x/99/eb/41/99eb41949eb698c8a8a7c545fb856674.jpg",
    "https://i.pinimg.com/736x/97/5e/99/975e99e7f09657512dc5740dabdd7252.jpg"
  ],
  "Bistro Chair Pair": [
    "https://i.pinimg.com/1200x/23/c1/c2/23c1c2a27092cb2a3457d207a2ab84fc.jpg",
    "https://i.pinimg.com/736x/be/6d/cc/be6dccd3dd4d7d54b94cf0c0a6eefd87.jpg",
    "https://i.pinimg.com/1200x/c8/8c/29/c88c29bdfb36bdd694803725628b0354.jpg",
    "https://i.pinimg.com/736x/80/d4/7e/80d47ee7d9444351b41fc010e7e23380.jpg"
  ],
  "Weatherproof Sofa": [
    "https://i.pinimg.com/736x/3b/ad/88/3bad881dbfb35eea176683d0c02c98bd.jpg",
    "https://i.pinimg.com/736x/85/b3/de/85b3de638bd3513323ea432115498bf6.jpg",
    "https://i.pinimg.com/736x/1e/ce/79/1ece79654e36e20e70ab5d20d0accd8e.jpg",
    "https://i.pinimg.com/736x/13/b8/72/13b872bb9250cd09745aacf832f3f60a.jpg"
  ],
  "Outdoor Dining Table": [
    "https://i.pinimg.com/1200x/4b/95/7d/4b957de8ee59d3e0c3a20d441262062a.jpg",
    "https://i.pinimg.com/1200x/6f/c2/e0/6fc2e0fee719cc86527557c254f2d528.jpg",
    "https://i.pinimg.com/736x/e5/31/f8/e531f87d9c91e174e3aa95a78d2b2050.jpg"
  ],
  "Patio Lounge Set": [
    "https://i.pinimg.com/1200x/79/00/0a/79000a8611b971afda221d7c07f073a0.jpg",
    "https://i.pinimg.com/1200x/b7/41/da/b741da97782fe06111713ddf70a5729a.jpg",
    "https://i.pinimg.com/1200x/cd/df/a6/cddfa6c57f28779a01250148bd665c1b.jpg",
    "https://i.pinimg.com/736x/71/0e/9c/710e9c189e78c6cb1daade6eff4564a1.jpg"
  ],
  "Soft Light Sconce": [
    "https://i.pinimg.com/736x/44/71/a5/4471a510f8f38bfeacde2503766ce6c0.jpg",
    "https://i.pinimg.com/736x/08/dd/92/08dd92ec565bb7b478ef9327310998d5.jpg",
    "https://i.pinimg.com/736x/75/60/d4/7560d483f690f53006da8ba11901053d.jpg",
    "https://i.pinimg.com/736x/22/89/9e/22899e8efd5a327a5181f8450323aa9d.jpg"
  ],
  "Teak Shower Bench": [
    "https://i.pinimg.com/736x/f2/64/30/f26430ebbffda3ce900bbc6bb18d9164.jpg",
    "https://i.pinimg.com/736x/bb/ca/f8/bbcaf84e39dee2004deb645eb2681f3b.jpg",
    "https://i.pinimg.com/736x/25/1f/2f/251f2fe586c5d1980baf10286362fa53.jpg",
    "https://i.pinimg.com/736x/a6/fc/a3/a6fca35632c4637a9f0ffa277a0d94b8.jpg"
  ],
  "Soft Glow Floor Lamp": [
"https://i.pinimg.com/1200x/d9/f6/5c/d9f65caa9d43618f27593a6cd1473ae4.jpg",
"https://i.pinimg.com/1200x/4e/30/d8/4e30d84becb832894dfb91cd09cd8823.jpg",
"https://i.pinimg.com/1200x/5f/2e/2d/5f2e2d17c28f9e0e0e222edeaeaac8fd.jpg",
"https://i.pinimg.com/1200x/2c/dc/0b/2cdc0bda2d6691c7787b3c65c1f2c72c.jpg"
  ],
  "Stoneware Dinner Set": [
    "https://i.pinimg.com/1200x/25/af/6c/25af6c05270f339315c75b9571bdde62.jpg",
    "https://i.pinimg.com/736x/d8/e6/f5/d8e6f56c9c626f5208768063046a0226.jpg",
    "https://i.pinimg.com/736x/54/a2/0f/54a20f820cc3d244a47a6746d907333e.jpg"
  ],
  "Amber Linen Throw": [
    "https://i.pinimg.com/736x/bd/8c/38/bd8c382858f9e86ebbcdfe835c8cc660.jpg",
    "https://i.pinimg.com/736x/35/c5/2c/35c52c0eab4b95e266b07c87fcf70052.jpg",
    "https://i.pinimg.com/736x/ec/73/35/ec733563240dae9a8bf97af33079087c.jpg",
  ],
  "Stonewashed Coffee Table": [
    "https://i.pinimg.com/736x/ec/1a/4e/ec1a4e35f6ef586afeaedb620e0ff92b.jpg",
    "https://i.pinimg.com/736x/db/70/39/db7039dd82beb2724712513189c2c293.jpg",
    "https://i.pinimg.com/736x/15/5c/db/155cdb4db0d6925f19abaa7186154e2d.jpg",
    "https://i.pinimg.com/1200x/2c/b0/a3/2cb0a30f4a4910aa9bb659ac9470cf3b.jpg"
  ],
  "Ribbed Cotton Towels": [
    "https://i.pinimg.com/736x/aa/58/25/aa5825e225c3e06f91ba623044da7a53.jpg",
    "https://i.pinimg.com/736x/8d/24/f4/8d24f4ab742897017b3f09f8514f4cc2.jpg",
    "https://i.pinimg.com/736x/e5/06/f4/e506f4d0bddcd7891ee5ecbc3e82af34.jpg",
    "https://i.pinimg.com/736x/b5/bc/ab/b5bcaba32c6cefc22d909b99141b0ffb.jpg"
  ],
  "Aroma Diffuser": [
    "https://i.pinimg.com/736x/bb/81/f8/bb81f82d442cc8626f04066a69a822f8.jpg",
    "https://i.pinimg.com/736x/09/49/2d/09492db59a6e90cf87ced8fc93b7302e.jpg",
    "https://i.pinimg.com/736x/17/a1/ff/17a1ffec695dd0313bec24ede4b0f4b7.jpg",
    "https://i.pinimg.com/736x/63/48/03/63480367a9b89d7b7508b822efba0fb4.jpg"
  ]
 
};

const productData = {
  "Marin Modular Sofa": {
    price: "$1,999",
    rating: "4.9 (1,284)",
    tag: "Living room",
    description: "Soft boucle, flexible layout, and family-ready comfort.",
  },
  "Brushed Oak Sideboard": { price: "$899", rating: "4.8 (740)", tag: "Storage" },
  "Sunset Woven Rug": { price: "$289", rating: "4.7 (2,103)", tag: "Rug" },
  "Matte Clay Lamp": { price: "$149", rating: "4.8 (410)", tag: "Lighting" },
  "Stoneware Dinner Set": { price: "$189", rating: "4.8 (620)", tag: "Kitchen" },
  "Utensil Starter Kit": { price: "$59", rating: "4.6 (1,104)", tag: "Kitchen" },
  "Espresso Compact Machine": { price: "$279", rating: "4.7 (860)", tag: "Appliances" },
  "Nova Dining Set": { price: "$1,299", rating: "4.6 (860)", tag: "Dining" },
  "Rowan Accent Chair": { price: "$459", rating: "4.7 (510)", tag: "Living room" },
  "Haze Linen Drapes": { price: "$129", rating: "4.6 (610)", tag: "Bedroom" },
  "Carbon Steel Skillet": { price: "$39", rating: "4.5 (240)", tag: "Kitchen" },
  "Chef Knife Set": { price: "$50", rating: "4.6 (247)", tag: "Kitchen" },
  "Ceramic Dinner Set": { price: "$61", rating: "4.7 (254)", tag: "Kitchen" },
  "Glass Storage Trio": { price: "$72", rating: "4.8 (261)", tag: "Kitchen" },
  "Walnut Cutting Board": { price: "$83", rating: "4.5 (268)", tag: "Kitchen" },
  "Matte Utensil Set": { price: "$94", rating: "4.6 (275)", tag: "Kitchen" },
  "Quiet Blender Pro": { price: "$116", rating: "4.8 (289)", tag: "Kitchen" },
  "Smart Toaster Oven": { price: "$199", rating: "4.8 (740)", tag: "Kitchen" },
  "Stainless Steel Cookware Set": { price: "$249", rating: "4.7 (520)", tag: "Kitchen" },
  "Oak Dining Table": { price: "$749", rating: "4.7 (480)", tag: "Dining" },
  "Canvas Dining Chair": { price: "$129", rating: "4.6 (360)", tag: "Dining" },
  "Stoneware Serve Set": { price: "$149", rating: "4.8 (420)", tag: "Dining" },
  "Textured Table Runner": { price: "$39", rating: "4.7 (210)", tag: "Dining" },
  "Oak Vanity Storage": { price: "$229", rating: "4.6 (280)", tag: "Bath" },
  "Waffle Towel Set": { price: "$59", rating: "4.8 (940)", tag: "Bath" },
  "Stone Soap Dispenser": { price: "$24", rating: "4.7 (510)", tag: "Bath" },
  "Rounded Bath Mirror": { price: "$149", rating: "4.6 (330)", tag: "Bath" },
  "Marble Rolling Pin": { price: "$52", rating: "4.7 (290)", tag: "Kitchen" },
  "Olive Wood Salad Set": { price: "$64", rating: "4.7 (340)", tag: "Kitchen" },
  "Ceramic Knife Set": { price: "$84", rating: "4.6 (210)", tag: "Kitchen" },
  "Smart Fridge": { price: "$2,399", rating: "4.7 (190)", tag: "Appliances" },
  "French Press Kit": { price: "$48", rating: "4.6 (220)", tag: "Kitchen" },
  "Nonstick Saucepan": { price: "$36", rating: "4.5 (180)", tag: "Kitchen" },
  "Cast Iron Dutch Oven": { price: "$129", rating: "4.8 (610)", tag: "Kitchen" },
  "Stoneware Mixing Bowl": { price: "$44", rating: "4.7 (250)", tag: "Kitchen" },
  "Tea Kettle": { price: "$34", rating: "4.6 (310)", tag: "Kitchen" },
  "Silicone Spatula Set": { price: "$22", rating: "4.6 (240)", tag: "Kitchen" },
  "Bamboo Prep Board": { price: "$28", rating: "4.6 (260)", tag: "Kitchen" },
  "Stainless Colander": { price: "$32", rating: "4.6 (190)", tag: "Kitchen" },
  "Measuring Cup Set": { price: "$26", rating: "4.5 (210)", tag: "Kitchen" },
  "Magnetic Knife Strip": { price: "$39", rating: "4.6 (170)", tag: "Kitchen" },
  "Pantry Canister Set": { price: "$54", rating: "4.7 (230)", tag: "Kitchen" },
  "Rattan Bar Stool": { price: "$119", rating: "4.6 (190)", tag: "Dining" },
  "Round Bistro Table": { price: "$349", rating: "4.6 (140)", tag: "Dining" },
  "Linen Napkin Set": { price: "$32", rating: "4.7 (180)", tag: "Dining" },
  "Low Profile Bench": { price: "$219", rating: "4.6 (210)", tag: "Dining" },
  "Porcelain Salad Bowl": { price: "$42", rating: "4.7 (200)", tag: "Dining" },
  "Glass Stemware Set": { price: "$58", rating: "4.7 (310)", tag: "Dining" },
  "Wooden Lazy Susan": { price: "$36", rating: "4.6 (190)", tag: "Dining" },
  "Ceramic Pitcher": { price: "$48", rating: "4.7 (160)", tag: "Dining" },
  "Napkin Ring Set": { price: "$24", rating: "4.6 (150)", tag: "Dining" },
  "Marble Serving Board": { price: "$58", rating: "4.8 (240)", tag: "Dining" },
  "Candlelight Centerpiece": { price: "$68", rating: "4.7 (120)", tag: "Dining" },
  "Woven Placemats": { price: "$34", rating: "4.6 (170)", tag: "Dining" },
  "Dining Chair Cushion": { price: "$29", rating: "4.6 (190)", tag: "Dining" },
  "Oak Sideboard": { price: "$999", rating: "4.8 (210)", tag: "Storage" },
  "Stoneware Mug Set": { price: "$46", rating: "4.7 (260)", tag: "Kitchen" },
  "Brass Cutlery Set": { price: "$74", rating: "4.7 (200)", tag: "Dining" },
  "Bath Mat Set": { price: "$39", rating: "4.7 (410)", tag: "Bath" },
};

const createPlaceholderDataUrl = (name) => {
  if (!name) return "";
  const safe = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f2e6db"/>
          <stop offset="100%" stop-color="#d7c8bb"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="24" fill="url(#bg)"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="Space Grotesk, Arial, sans-serif" font-size="28" fill="#6b5b52">
        ${safe}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ensureImage = (target, name, url) => {
  if (!target) return;

  const placeholder = createPlaceholderDataUrl(name);
  if (placeholder) {
    target.style.backgroundImage = `url(${placeholder})`;
    target.style.backgroundSize = "cover";
    target.style.backgroundPosition = "center";
    target.style.backgroundRepeat = "no-repeat";
  }

  const probe = new Image();
  probe.onload = () => {
    target.style.backgroundImage = `url(${url})`;
    target.style.backgroundSize = "cover";
    target.style.backgroundPosition = "center";
    target.style.backgroundRepeat = "no-repeat";
  };
  probe.onerror = () => {
    // keep placeholder
  };
  probe.src = url;
};

const getExistingRating = (text) => {
  if (!text) return "";
  const parts = text.split("·").map((item) => item.trim());
  return parts.length > 1 ? parts[1] : "";
};

const applyProductMeta = () => {
  const cards = document.querySelectorAll(
    ".product-grid article, .carousel-track article, .recent-grid article, .room-cards article"
  );

  cards.forEach((card) => {
    const name = getProductNameFromCard(card);
    if (!name || !productData[name]) return;

    const data = productData[name];
    const meta = card.querySelector(".product-meta");

    if (meta) {
      const priceEl = meta.querySelector("p");
      if (priceEl && data.price) {
        const rating = data.rating || getExistingRating(priceEl.textContent);
        priceEl.textContent = rating ? `${data.price} · ${rating}` : data.price;
      }

      const pill = meta.querySelector(".pill");
      if (pill && data.tag) {
        pill.textContent = data.tag;
      }
      return;
    }

    const priceText = card.querySelector("p");
    if (priceText && data.price) {
      const rating = data.rating || getExistingRating(priceText.textContent);
      priceText.textContent = rating ? `${data.price} · ${rating}` : data.price;
    }
  });
};

const applyProductImages = () => {
  const titleElements = document.querySelectorAll(
    ".product-meta h4, .card-meta h4, .room-card h4, .hero-card h3, .product-gallery h2, .carousel-track h4, .recent-grid h4, .mini-card p"
  );

  titleElements.forEach((el) => {
    const name = el.textContent?.trim();
    if (!name || !productImages[name]) return;

    const imageTarget =
      el.closest("article")?.querySelector(".product-image, .card-image, .review-photo, .room-image") ||
      el.closest(".hero-card")?.querySelector(".hero-card-image") ||
      el.closest(".product-gallery")?.querySelector(".product-image") ||
      el.closest(".mini-card")?.querySelector(".mini-image") ||
      el.closest(".product-thumb-row")?.querySelector(".product-thumb") ||
      el.closest("section")?.querySelector(".product-image, .card-image, .room-image");

    ensureImage(imageTarget, name, productImages[name]);
  });
};

const getProductNameFromCard = (card) => {
  const title =
    card.querySelector(".product-meta h4") ||
    card.querySelector(".card-meta h4") ||
    card.querySelector("h4") ||
    card.querySelector("h3");
  return title?.textContent?.trim() || "";
};

const setupProductLinks = () => {
  const cards = document.querySelectorAll(
    ".product-grid article, .carousel-track article, .recent-grid article, .mini-grid .mini-card, .room-cards article"
  );

  cards.forEach((card) => {
    if (card.dataset.productLink === "true") return;
    const name = getProductNameFromCard(card);
    if (!name) return;

    card.dataset.productLink = "true";
    card.tabIndex = 0;
    card.style.cursor = "pointer";

    const navigate = () => {
      window.location.href = `product.html?name=${encodeURIComponent(name)}`;
    };

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea")) return;
      navigate();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigate();
      }
    });
  });
};

const getCardInfo = (card) => {
  const name = getProductNameFromCard(card);
  const priceText =
    card.querySelector(".product-meta p")?.textContent ||
    card.querySelector("p")?.textContent ||
    "";
  const unitPrice = parsePriceValue(priceText);
  const price = unitPrice ? formatCurrency(unitPrice) : priceText.split("·")[0].trim();
  const tag = card.querySelector(".pill")?.textContent?.trim() || productData[name]?.tag || "";
  return { name, price, unitPrice, tag };
};

const addToCartFromInfo = (info) => {
  if (!info.name) return;
  upsertCartItem({
    name: info.name,
    price: info.price || formatCurrency(info.unitPrice || 0),
    unitPrice: info.unitPrice || parsePriceValue(info.price || "0"),
    tag: info.tag || "",
    image: productImages[info.name] || "",
  });
  renderCart();
};

const setupAddToCartButtons = () => {
  const cards = document.querySelectorAll(
    ".product-grid article, .carousel-track article, .recent-grid article, .search-results-grid article"
  );

  cards.forEach((card) => {
    if (card.querySelector(".add-to-cart")) return;
    const meta = card.querySelector(".product-meta") || card;
    const button = document.createElement("button");
    button.className = "ghost-button add-to-cart";
    button.type = "button";
    button.textContent = "Add to cart";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const info = getCardInfo(card);
      addToCartFromInfo(info);
    });
    meta.appendChild(button);
  });

  const heroCta = document.querySelector(".hero-cta");
  if (heroCta && !heroCta.querySelector(".add-to-cart")) {
    const heroName = document
      .querySelector(".hero-card-row span:first-child")
      ?.textContent?.trim();
    const heroPriceText = document
      .querySelector(".hero-card-row span:last-child")
      ?.textContent?.trim();
    const button = document.createElement("button");
    button.className = "ghost-button add-to-cart";
    button.type = "button";
    button.textContent = "Add to cart";
    button.addEventListener("click", () => {
      addToCartFromInfo({
        name: heroName || "",
        price: heroPriceText || "",
        unitPrice: parsePriceValue(heroPriceText || "0"),
        tag: "Living room",
      });
    });
    heroCta.appendChild(button);
  }
};

const setupAddToCartDetail = () => {
  const button = document.querySelector("[data-add-to-cart]");
  if (!button) return;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const name =
      document.querySelector(".product-hero .eyebrow")?.textContent?.trim() ||
      document.querySelector(".product-details .eyebrow")?.textContent?.trim() ||
      "";
    const priceText =
      document.querySelector(".price-row h2")?.textContent?.trim() || "";
    addToCartFromInfo({
      name,
      price: priceText,
      unitPrice: parsePriceValue(priceText),
      tag: productData[name]?.tag || "Selected item",
    });
    window.location.href = "cart.html";
  });
};

const renderCart = () => {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;

  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const deliveryEl = document.querySelector("[data-cart-delivery]");
  const taxEl = document.querySelector("[data-cart-tax]");
  const totalEl = document.querySelector("[data-cart-total]");

  const items = loadCart();
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.innerHTML = `
      <h3>Your cart is empty.</h3>
      <p>Find pieces you love and add them here.</p>
      <a class="solid-button" href="products.html">Browse products</a>
    `;
    container.appendChild(empty);
  }

  let subtotal = 0;

  items.forEach((item) => {
    const unitPrice = item.unitPrice || parsePriceValue(item.price);
    subtotal += unitPrice * item.qty;

    const article = document.createElement("article");
    article.className = "cart-item";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image";
    if (item.image) {
      ensureImage(imageWrap, item.name, item.image);
    }

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const metaLine = document.createElement("p");
    metaLine.textContent = item.tag || "Selected item";

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";

    const qtyWrap = document.createElement("div");
    qtyWrap.className = "cart-qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.addEventListener("click", () => {
      updateCartQty(item.name, -1);
      renderCart();
    });

    const qtyValue = document.createElement("span");
    qtyValue.textContent = String(item.qty);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.addEventListener("click", () => {
      updateCartQty(item.name, 1);
      renderCart();
    });

    qtyWrap.appendChild(minus);
    qtyWrap.appendChild(qtyValue);
    qtyWrap.appendChild(plus);

    const price = document.createElement("span");
    price.textContent = formatCurrency(unitPrice * item.qty);

    meta.appendChild(qtyWrap);
    meta.appendChild(price);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const remove = document.createElement("button");
    remove.className = "ghost-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      removeCartItem(item.name);
      renderCart();
    });

    actions.appendChild(remove);

    details.appendChild(title);
    details.appendChild(metaLine);
    details.appendChild(meta);
    details.appendChild(actions);

    article.appendChild(imageWrap);
    article.appendChild(details);

    container.appendChild(article);
  });

  const delivery = items.length ? 144 : 0;
  const tax = subtotal * 0.0725;
  const total = subtotal + delivery + tax;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatCurrency(delivery);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);
};

const renderCheckout = () => {
  const itemsWrap = document.querySelector("[data-checkout-items]");
  if (!itemsWrap) return;
  const deliveryEl = document.querySelector("[data-checkout-delivery]");
  const taxEl = document.querySelector("[data-checkout-tax]");
  const totalEl = document.querySelector("[data-checkout-total]");

  const items = loadCart();
  itemsWrap.innerHTML = "";

  let subtotal = 0;
  items.forEach((item) => {
    const unitPrice = item.unitPrice || parsePriceValue(item.price);
    subtotal += unitPrice * item.qty;
    const row = document.createElement("div");
    row.className = "summary-row";
    row.innerHTML = `
      <span>${item.name} · Qty ${item.qty}</span>
      <span>${formatCurrency(unitPrice * item.qty)}</span>
    `;
    itemsWrap.appendChild(row);
  });

  const delivery = items.length ? 144 : 0;
  const tax = subtotal * 0.0725;
  const total = subtotal + delivery + tax;

  if (deliveryEl) deliveryEl.textContent = formatCurrency(delivery);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);
};

const clearFieldError = (field) => {
  field.classList.remove("input-error");
  const error = field.parentElement?.querySelector(".field-error");
  if (error) error.remove();
};

const setFieldError = (field, message) => {
  field.classList.add("input-error");
  let error = field.parentElement?.querySelector(".field-error");
  if (!error) {
    error = document.createElement("div");
    error.className = "field-error";
    field.parentElement?.appendChild(error);
  }
  error.textContent = message;
};

const validateField = (field) => {
  const value = field.value.trim();
  if (field.dataset.required === "true" && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.dataset.email === "true") {
    const valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
    if (!valid) {
      setFieldError(field, "Enter a valid email.");
      return false;
    }
  }

  if (field.dataset.zip === "true") {
    const valid = /^\\d{4,10}$/.test(value);
    if (!valid) {
      setFieldError(field, "Enter a valid ZIP.");
      return false;
    }
  }

  if (field.dataset.phone === "true") {
    const valid = /^[+\\d][\\d\\s().-]{6,}$/.test(value);
    if (!valid) {
      setFieldError(field, "Enter a valid phone number.");
      return false;
    }
  }

  if (field.dataset.card === "true") {
    const digits = value.replace(/\\D/g, "");
    if (digits.length < 12 || digits.length > 19) {
      setFieldError(field, "Enter a valid card number.");
      return false;
    }
  }

  if (field.dataset.cvc === "true") {
    if (!/^\\d{3,4}$/.test(value)) {
      setFieldError(field, "Enter a valid CVC.");
      return false;
    }
  }

  if (field.dataset.expiry === "true") {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\\d{2})$/);
    if (!match) {
      setFieldError(field, "Use MM/YY.");
      return false;
    }
    const month = Number.parseInt(match[1], 10);
    const year = 2000 + Number.parseInt(match[2], 10);
    const now = new Date();
    const exp = new Date(year, month);
    if (exp <= now) {
      setFieldError(field, "Card is expired.");
      return false;
    }
  }

  clearFieldError(field);
  return true;
};

const validateCheckout = () => {
  const deliveryForm = document.querySelector("[data-checkout-delivery]");
  const activePanel = document.querySelector(".payment-panel.is-active");
  const fields = [
    ...Array.from(deliveryForm?.querySelectorAll("input, select") || []),
    ...Array.from(activePanel?.querySelectorAll("input, select") || []),
  ];

  let ok = true;
  fields.forEach((field) => {
    if (!validateField(field)) ok = false;
  });

  return ok;
};

const setupPaymentMock = () => {
  const options = document.querySelectorAll(".payment-option");
  const placeOrder = document.querySelector("[data-place-order]");
  const panels = document.querySelectorAll("[data-payment-panel]");
  if (!options.length && !placeOrder) return;

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((btn) => btn.classList.remove("is-active"));
      option.classList.add("is-active");
      const mode = option.dataset.payment;
      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.paymentPanel === mode);
      });
    });
  });

  if (placeOrder) {
    placeOrder.addEventListener("click", () => {
      const isValid = validateCheckout();
      if (!isValid) return;
      placeOrder.disabled = true;
      placeOrder.textContent = "Processing...";
      setTimeout(() => {
        window.location.href = "confirmation.html";
      }, 900);
    });
  }
};

const setupAuthForms = () => {
  const loginBtn = document.querySelector("[data-auth-login]");
  const signupBtn = document.querySelector("[data-auth-signup]");
  const forgotToggle = document.querySelector("[data-forgot-toggle]");
  const forgotPanel = document.querySelector("[data-forgot-panel]");
  const forgotSend = document.querySelector("[data-forgot-send]");
  const forgotEmail = document.querySelector("[data-forgot-email]");
  const returnTo = new URLSearchParams(window.location.search).get("return");

  const goNext = () => {
    window.location.href = returnTo === "checkout" ? "checkout.html" : "dashboard.html";
  };

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const termsAccepted = document.querySelector("[data-login-terms]")?.checked;
      const email = document.querySelector("[data-login-email]")?.value?.trim();
      const password = document.querySelector("[data-login-password]")?.value?.trim();
      if (!termsAccepted) {
        alert("Please accept the Terms & Conditions to continue.");
        return;
      }
      if (!email || !password) {
        alert("Enter your email and password.");
        return;
      }
      const users = loadUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        alert("Invalid email or password.");
        return;
      }
      setAuthed(user);
      goNext();
    });
  }

  if (forgotToggle && forgotPanel) {
    forgotToggle.addEventListener("click", () => {
      forgotPanel.classList.toggle("is-hidden");
    });
  }

  if (forgotSend) {
    forgotSend.addEventListener("click", () => {
      const email = forgotEmail?.value?.trim();
      if (!email) {
        alert("Enter the email address for your account.");
        return;
      }
      alert(`Password reset link sent to ${email}.`);
      if (forgotPanel) forgotPanel.classList.add("is-hidden");
      if (forgotEmail) forgotEmail.value = "";
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      const termsAccepted = document.querySelector("[data-signup-terms]")?.checked;
      const name = document.querySelector("[data-signup-name]")?.value?.trim();
      const email = document.querySelector("[data-signup-email]")?.value?.trim();
      const password = document.querySelector("[data-signup-password]")?.value?.trim();
      const style = document.querySelector("[data-signup-style]")?.value?.trim() || "Modern";
      if (!termsAccepted) {
        alert("Please accept the Terms & Conditions to continue.");
        return;
      }
      if (!name || !email || !password) {
        alert("Complete all required fields.");
        return;
      }
      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        alert("An account with this email already exists.");
        return;
      }
      const user = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        style,
      };
      users.push(user);
      saveUsers(users);
      setAuthed(user);
      goNext();
    });
  }
};

const setupGoogleLogin = () => {
  const targets = document.querySelectorAll("[data-google-signin]");
  if (!targets.length || !window.google?.accounts?.id) return;

  const returnTo = new URLSearchParams(window.location.search).get("return");

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: () => {
      const user = {
        id: `google_${Date.now()}`,
        name: "Google User",
        email: "google.user@gmail.com",
        style: "Modern",
      };
      setAuthed(user);
      window.location.href = returnTo === "checkout" ? "checkout.html" : "dashboard.html";
    },
  });

  targets.forEach((target) => {
    target.innerHTML = "";
    window.google.accounts.id.renderButton(target, {
      theme: "outline",
      size: "large",
      width: 260,
      text: "continue_with",
    });
  });
};

const gateCheckout = () => {
  const isCheckout = window.location.pathname.toLowerCase().endsWith("checkout.html");
  const alertBox = document.querySelector("[data-auth-alert]");
  const placeOrder = document.querySelector("[data-place-order]");

  if (isCheckout) {
    if (isAuthed()) {
      if (alertBox) alertBox.hidden = true;
      if (placeOrder) placeOrder.disabled = false;
    } else {
      if (alertBox) alertBox.hidden = false;
      if (placeOrder) placeOrder.disabled = true;
    }
  }

  const checkoutLinks = document.querySelectorAll("[data-checkout-gate]");
  checkoutLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (isAuthed()) return;
      event.preventDefault();
      window.location.href = "login.html?return=checkout";
    });
  });
};

const setupDashboard = () => {
  const isDashboard = window.location.pathname.toLowerCase().endsWith("dashboard.html");
  if (!isDashboard) return;

  if (!isAuthed()) {
    window.location.href = "login.html";
    return;
  }

  const user = getCurrentUser();
  if (!user) return;

  const nameHeading = document.querySelector("[data-dashboard-name]");
  const nameInput = document.querySelector("[data-dashboard-name-input]");
  const emailInput = document.querySelector("[data-dashboard-email-input]");
  const styleInput = document.querySelector("[data-dashboard-style-input]");
  const passwordInput = document.querySelector("[data-dashboard-password-input]");
  const saveBtn = document.querySelector("[data-dashboard-save]");
  const logoutBtn = document.querySelector("[data-dashboard-logout]");

  if (nameHeading) nameHeading.textContent = `Welcome back, ${user.name}.`;
  if (nameInput) nameInput.value = user.name || "";
  if (emailInput) emailInput.value = user.email || "";
  if (styleInput) styleInput.value = user.style || "Modern";

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const users = loadUsers();
      const updated = {
        ...user,
        name: nameInput?.value?.trim() || user.name,
        email: emailInput?.value?.trim() || user.email,
        style: styleInput?.value || user.style,
        password: passwordInput?.value?.trim() || user.password,
      };

      const index = users.findIndex((u) => u.id === user.id || u.email === user.email);
      if (index >= 0) {
        users[index] = updated;
      } else {
        users.push(updated);
      }
      saveUsers(users);
      setAuthed(updated);
      if (passwordInput) passwordInput.value = "";
      alert("Profile updated.");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuthed();
      window.location.href = "index.html";
    });
  }
};

const updateAuthUI = () => {
  const authed = isAuthed();
  const guestEls = document.querySelectorAll("[data-auth-guest]");
  const userEls = document.querySelectorAll("[data-auth-user]");
  const authAlerts = document.querySelectorAll("[data-auth-alert]");
  guestEls.forEach((el) => {
    el.style.display = authed ? "none" : "";
  });
  userEls.forEach((el) => {
    el.style.display = authed ? "" : "none";
  });
  authAlerts.forEach((alert) => {
    if (authed) {
      alert.remove();
    } else {
      alert.hidden = false;
    }
  });
};

const setupAuthUI = () => {
  const logoutButtons = document.querySelectorAll("[data-auth-logout]");
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearAuthed();
      updateAuthUI();
      if (window.location.pathname.toLowerCase().endsWith("dashboard.html")) {
        window.location.href = "index.html";
      }
    });
  });

  const isLogin = window.location.pathname.toLowerCase().endsWith("login.html");
  const isSignup = window.location.pathname.toLowerCase().endsWith("signup.html");
  if (isAuthed() && (isLogin || isSignup)) {
    window.location.href = "dashboard.html";
    return;
  }

  updateAuthUI();
};

const applyProductDetailFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const queryName = params.get("name");
  const defaultName = document.querySelector(".product-details .eyebrow")?.textContent?.trim();
  const name = queryName || defaultName;
  if (!name) return;

  if (queryName) {
    const eyebrow = document.querySelector(".product-details .eyebrow");
    if (eyebrow) eyebrow.textContent = name;

    const heading = document.querySelector(".product-details h1");
    if (heading) heading.textContent = name;

    document.title = `CORRIESELLS | ${name}`;
  }

  const priceEl = document.querySelector(".product-details .price-row h2");
  if (priceEl && productData[name]?.price) {
    priceEl.textContent = productData[name].price;
  }

  const descriptionEl = document.querySelector(".product-details > p");
  if (descriptionEl && productData[name]?.description) {
    descriptionEl.textContent = productData[name].description;
  }

  const heroImage = document.querySelector(".product-gallery .product-image.hero");
  const galleryImages = productGalleryImages[name] || [];
  const primaryImage = galleryImages[0] || productImages[name];

  if (heroImage && primaryImage) {
    ensureImage(heroImage, name, primaryImage);
  }

  const thumbs = document.querySelectorAll(".product-thumb-row .product-thumb");
  thumbs.forEach((thumb, index) => {
    const imageUrl = galleryImages[index] || primaryImage;
    if (imageUrl) {
      ensureImage(thumb, name, imageUrl);
    }
  });
};

const setupHeroGallery = () => {
  const heroImage = document.querySelector(".product-gallery .product-image.hero");
  const thumbs = document.querySelectorAll(".product-thumb-row .product-thumb");
  if (!heroImage || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    if (thumb.dataset.galleryThumb === "true") return;
    thumb.dataset.galleryThumb = "true";
    thumb.tabIndex = 0;
    thumb.style.cursor = "pointer";

    const swapHero = () => {
      const img = thumb.querySelector("img[data-product-image]");
      const src = img?.src;
      if (!src) return;
      ensureImage(heroImage, img.alt || "Product image", src);
    };

    thumb.addEventListener("click", swapHero);
    thumb.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        swapHero();
      }
    });
  });
};

const mockSearchResults = [
  {
    title: "Marin Modular Sofa",
    price: "$1,999",
    rating: "4.9 (1,284)",
    tags: ["AR ready", "living room", "boucle"],
  },
  {
    title: "Rowan Accent Chair",
    price: "$459",
    rating: "4.7 (510)",
    tags: ["limited stock", "chair", "leather"],
  },
  {
    title: "Sunset Woven Rug",
    price: "$289",
    rating: "4.7 (2,103)",
    tags: ["best seller", "rug", "warm"],
  },
  {
    title: "Matte Clay Lamp",
    price: "$149",
    rating: "4.8 (410)",
    tags: ["ships in 48h", "lighting"],
  },
  {
    title: "Brushed Oak Sideboard",
    price: "$899",
    rating: "4.8 (740)",
    tags: ["free delivery", "storage"],
  },
  {
    title: "Haze Linen Drapes",
    price: "$129",
    rating: "4.6 (610)",
    tags: ["soft light", "bedroom"],
  },
  {
    title: "Nova Dining Set",
    price: "$1,299",
    rating: "4.6 (860)",
    tags: ["dining", "family size"],
  },
  {
    title: "Amber Linen Throw",
    price: "$89",
    rating: "4.8 (320)",
    tags: ["decor", "warm neutrals"],
  },
  {
    title: "Stoneware Dinner Set",
    price: "$189",
    rating: "4.8 (620)",
    tags: ["kitchen", "dinnerware", "stoneware"],
  },
  {
    title: "Utensil Starter Kit",
    price: "$59",
    rating: "4.6 (1,104)",
    tags: ["utensils", "kitchen", "best value"],
  },
  {
    title: "Matte Utensil Set",
    price: "$39",
    rating: "4.5 (970)",
    tags: ["utensils", "kitchen", "daily use"],
  },
  {
    title: "Walnut Cutting Board",
    price: "$64",
    rating: "4.8 (312)",
    tags: ["kitchen", "prep", "wood"],
  },
  {
    title: "Carbon Steel Pan",
    price: "$89",
    rating: "4.7 (540)",
    tags: ["cookware", "kitchen"],
  },
  {
    title: "Glass Storage Trio",
    price: "$52",
    rating: "4.6 (410)",
    tags: ["pantry", "storage", "kitchen"],
  },
  {
    title: "Espresso Compact Machine",
    price: "$279",
    rating: "4.7 (860)",
    tags: ["appliances", "kitchen", "coffee"],
  },
  {
    title: "Quiet Blender Pro",
    price: "$149",
    rating: "4.6 (1,020)",
    tags: ["appliances", "kitchen", "smoothies"],
  },
  {
    title: "Smart Toaster Oven",
    price: "$199",
    rating: "4.8 (740)",
    tags: ["appliances", "kitchen", "bake"],
  },
  {
    title: "Oak Dining Table",
    price: "$749",
    rating: "4.7 (480)",
    tags: ["dining", "table", "wood"],
  },
  {
    title: "Canvas Dining Chair",
    price: "$189",
    rating: "4.6 (260)",
    tags: ["dining", "chairs", "fabric"],
  },
  {
    title: "Stoneware Serve Set",
    price: "$129",
    rating: "4.8 (310)",
    tags: ["dining", "serveware", "stoneware"],
  },
  {
    title: "Textured Table Runner",
    price: "$39",
    rating: "4.5 (620)",
    tags: ["dining", "linen", "table"],
  },
  {
    title: "Oak Vanity Storage",
    price: "$329",
    rating: "4.6 (210)",
    tags: ["bath", "storage", "vanity"],
  },
  {
    title: "Waffle Towel Set",
    price: "$59",
    rating: "4.8 (940)",
    tags: ["bath", "linens", "towels"],
  },
  {
    title: "Stone Soap Dispenser",
    price: "$24",
    rating: "4.7 (510)",
    tags: ["bath", "countertop", "stone"],
  },
  {
    title: "Rounded Bath Mirror",
    price: "$149",
    rating: "4.6 (330)",
    tags: ["bath", "mirror", "wall decor"],
  },
];

const colorClassByIndex = ["", "warm", "cool", "alt", "", "warm", "cool", "alt"];

const parsePriceValue = (value) => {
  if (!value) return 0;
  const numeric = value.replace(/[^0-9.]/g, "");
  return Number.parseFloat(numeric) || 0;
};

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return "$0";
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    // ignore storage failures
  }
};

const isAuthed = () => {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch (err) {
    return false;
  }
};

const setAuthed = (user) => {
  try {
    localStorage.setItem(AUTH_KEY, "true");
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    // ignore storage failures
  }
};

const clearAuthed = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (err) {
    // ignore storage failures
  }
};

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    // ignore storage failures
  }
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};

const upsertCartItem = (item) => {
  const items = loadCart();
  const existing = items.find((entry) => entry.name === item.name);
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    items.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(items);
};

const updateCartQty = (name, delta) => {
  const items = loadCart();
  const existing = items.find((entry) => entry.name === name);
  if (!existing) return;
  existing.qty = Math.max(1, existing.qty + delta);
  saveCart(items);
};

const removeCartItem = (name) => {
  const items = loadCart().filter((entry) => entry.name !== name);
  saveCart(items);
};

const getSearchFilters = () => {
  return {
    room: searchRoomSelect?.value?.toLowerCase() || "any room",
    style: searchStyleSelect?.value?.toLowerCase() || "any style",
    color: searchColorSelect?.value?.toLowerCase() || "any color",
    maxPrice: parsePriceValue(searchBudget?.value),
    delivery: Array.from(searchToggles)
      .filter((toggle) => toggle.classList.contains("is-active"))
      .map((toggle) => toggle.textContent.trim().toLowerCase()),
  };
};

const getItemRoomTags = (item) => {
  const tags = new Set(item.tags || []);
  const data = productData[item.title];
  if (data?.tag) tags.add(data.tag.toLowerCase());
  return tags;
};

const getItemStyleTags = (item) => {
  const tags = new Set();
  const joined = `${item.title} ${(item.tags || []).join(" ")}`.toLowerCase();
  if (/(wood|oak|walnut|teak|linen)/.test(joined)) {
    tags.add("japandi");
    tags.add("scandi");
  }
  if (/(minimal|matte|clean)/.test(joined)) tags.add("minimal");
  tags.add("modern");
  return tags;
};

const getItemColorTags = (item) => {
  const tags = new Set();
  const name = item.title.toLowerCase();
  if (/(walnut|oak|teak)/.test(name)) tags.add("warm neutrals");
  if (/(stone|marble|sand)/.test(name)) tags.add("sand");
  if (/(charcoal|black)/.test(name)) tags.add("charcoal");
  if (/(olive)/.test(name)) tags.add("olive");
  return tags;
};

const getDeliveryTags = (index) => {
  const tags = new Set(["in stock"]);
  if (index % 2 === 0) tags.add("free delivery");
  if (index % 3 === 0) tags.add("ships in 48h");
  return tags;
};

const renderResults = (query) => {
  if (!resultsWrapper || !resultsGrid || !resultsHeader || !resultsCount || !emptyState) return;

  const cleanQuery = query.trim();
  const terms = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const filters = getSearchFilters();
  const filtered = terms.length
    ? mockSearchResults.filter((item, index) => {
        const text = `${item.title} ${item.tags.join(" ")}`.toLowerCase();
        const termMatch = terms.every((term) => text.includes(term));
        if (!termMatch) return false;

        if (filters.room !== "any room") {
          const roomTags = getItemRoomTags(item);
          if (![filters.room, filters.room.replace(" ", "")].some((tag) => roomTags.has(tag))) {
            return false;
          }
        }

        if (filters.style !== "any style") {
          const styleTags = getItemStyleTags(item);
          if (!styleTags.has(filters.style)) return false;
        }

        if (filters.color !== "any color") {
          const colorTags = getItemColorTags(item);
          if (!colorTags.has(filters.color)) return false;
        }

        if (filters.maxPrice) {
          const data = productData[item.title];
          const priceValue = parsePriceValue(data?.price || item.price);
          if (priceValue > filters.maxPrice) return false;
        }

        if (filters.delivery.length) {
          const deliveryTags = getDeliveryTags(index);
          if (!filters.delivery.every((tag) => deliveryTags.has(tag))) return false;
        }

        return true;
      })
    : [];

  resultsHeader.textContent = cleanQuery
    ? `Results for “${cleanQuery}”`
    : "Start typing to explore";

  resultsCount.textContent = cleanQuery
    ? `Showing ${Math.min(filtered.length, 6)} of ${filtered.length}`
    : "Popular picks across rooms";

  resultsGrid.innerHTML = "";

  if (!filtered.length) {
    resultsWrapper.classList.add("empty");
    return;
  }

  resultsWrapper.classList.remove("empty");

  filtered.slice(0, 6).forEach((item, index) => {
    const article = document.createElement("article");
    const image = document.createElement("div");
    image.className = `product-image ${colorClassByIndex[index]}`.trim();

    const meta = document.createElement("div");
    meta.className = "product-meta";

    const title = document.createElement("h4");
    title.textContent = item.title;

    const price = document.createElement("p");
    const data = productData[item.title];
    const priceValue = data?.price || item.price;
    const ratingValue = data?.rating || item.rating;
    price.textContent = ratingValue ? `${priceValue} · ${ratingValue}` : priceValue;

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = data?.tag || item.tags[0];

    meta.appendChild(title);
    meta.appendChild(price);
    meta.appendChild(pill);

    article.appendChild(image);
    article.appendChild(meta);

    resultsGrid.appendChild(article);
  });

  applyProductImages();
  applyProductMeta();
  setupProductLinks();
  setupAddToCartButtons();
};

const handleSearch = () => {
  if (!searchInput) return;
  renderResults(searchInput.value);
};

const updateBudgetLabel = () => {
  if (!searchBudget || !searchBudgetValue) return;
  const value = parsePriceValue(searchBudget.value);
  searchBudgetValue.textContent = `$${value.toLocaleString()} max`;
};

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = button.textContent.trim();
    searchInput.focus();
    handleSearch();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
}

if (searchSubmit) {
  searchSubmit.addEventListener("click", handleSearch);
}

if (searchRoomSelect) {
  searchRoomSelect.addEventListener("change", handleSearch);
}

if (searchStyleSelect) {
  searchStyleSelect.addEventListener("change", handleSearch);
}

if (searchColorSelect) {
  searchColorSelect.addEventListener("change", handleSearch);
}

if (searchBudget) {
  searchBudget.addEventListener("input", () => {
    updateBudgetLabel();
    handleSearch();
  });
}

searchToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("is-active");
    handleSearch();
  });
});

if (searchClear) {
  searchClear.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (searchRoomSelect) searchRoomSelect.selectedIndex = 0;
    if (searchStyleSelect) searchStyleSelect.selectedIndex = 0;
    if (searchColorSelect) searchColorSelect.selectedIndex = 0;
    if (searchBudget) searchBudget.value = "1500";
    updateBudgetLabel();
    searchToggles.forEach((toggle) => toggle.classList.remove("is-active"));
    renderResults("");
  });
}

if (searchInput) {
  const defaultQuery = searchInput.value;
  searchInput.value = defaultQuery;
  renderResults(defaultQuery);
}

if (searchBudgetValue) {
  updateBudgetLabel();
}

const getSelectedFilters = () => {
  const selected = {};
  filterInputs.forEach((input) => {
    if (!input.checked) return;
    const group = input.dataset.filter;
    if (!selected[group]) {
      selected[group] = new Set();
    }
    selected[group].add(input.value);
  });
  return selected;
};

const applyFilters = () => {
  if (!filterGrid || !filterCount) return;

  const cards = Array.from(filterGrid.children);
  const selected = getSelectedFilters();
  const groups = Object.keys(selected);

  let visibleCount = 0;

  cards.forEach((card) => {
    const matches = groups.every((group) => {
      const value = card.dataset[group] || "";
      return selected[group].has(value);
    });

    if (groups.length === 0 || matches) {
      card.style.display = "";
      visibleCount += 1;
    } else {
      card.style.display = "none";
    }
  });

  filterCount.textContent = visibleCount.toString();
};

const clearFilters = () => {
  filterInputs.forEach((input) => {
    input.checked = false;
  });
  applyFilters();
};

const closeDrawer = () => {
  if (!mobileDrawer || !drawerBackdrop) return;
  mobileDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
};

const openDrawer = () => {
  if (!mobileDrawer || !drawerBackdrop) return;
  mobileDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
};

const closeFilterPanel = () => {
  if (!filterPanel) return;
  filterPanel.classList.remove("open");
};

const openFilterPanel = () => {
  if (!filterPanel) return;
  filterPanel.classList.add("open");
};

if (menuToggle) {
  menuToggle.addEventListener("click", openDrawer);
}

if (menuClose) {
  menuClose.addEventListener("click", closeDrawer);
}

if (drawerBackdrop) {
  drawerBackdrop.addEventListener("click", closeDrawer);
}

if (filterToggle) {
  filterToggle.addEventListener("click", openFilterPanel);
}

if (filterClose) {
  filterClose.addEventListener("click", closeFilterPanel);
}

if (filterPanel) {
  filterPanel.addEventListener("click", (event) => {
    if (event.target === filterPanel) {
      closeFilterPanel();
    }
  });
}

if (filterApply) {
  filterApply.addEventListener("click", () => {
    applyFilters();
    closeFilterPanel();
  });
}

if (filterClear) {
  filterClear.addEventListener("click", clearFilters);
}

if (filterInputs.length) {
  applyFilters();
}

applyProductImages();
applyProductMeta();
setupProductLinks();
applyProductDetailFromQuery();
setupHeroGallery();
setupAddToCartButtons();
setupAddToCartDetail();
renderCart();
renderCheckout();
setupPaymentMock();
setupAuthForms();
setupGoogleLogin();
gateCheckout();
setupDashboard();
setupAuthUI();

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeFilterPanel();
  }
});

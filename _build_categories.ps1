$categories = @(
  @{ key = 'kitchen'; title = 'Kitchen'; items = @(
    'Carbon Steel Skillet', 'Chef Knife Set', 'Ceramic Dinner Set', 'Glass Storage Trio', 'Walnut Cutting Board',
    'Matte Utensil Set', 'Espresso Compact Machine', 'Quiet Blender Pro', 'Smart Toaster Oven', 'French Press Kit',
    'Nonstick Saucepan', 'Cast Iron Dutch Oven', 'Stoneware Mixing Bowl', 'Tea Kettle', 'Silicone Spatula Set',
    'Bamboo Prep Board', 'Stainless Colander', 'Measuring Cup Set', 'Magnetic Knife Strip', 'Pantry Canister Set'
  )},
  @{ key = 'dining'; title = 'Dining'; items = @(
    'Oak Dining Table', 'Canvas Dining Chair', 'Stoneware Serve Set', 'Textured Table Runner', 'Rattan Bar Stool',
    'Round Bistro Table', 'Linen Napkin Set', 'Low Profile Bench', 'Porcelain Salad Bowl', 'Glass Stemware Set',
    'Wooden Lazy Susan', 'Ceramic Pitcher', 'Napkin Ring Set', 'Marble Serving Board', 'Candlelight Centerpiece',
    'Woven Placemats', 'Dining Chair Cushion', 'Oak Sideboard', 'Stoneware Mug Set', 'Brass Cutlery Set'
  )},
  @{ key = 'bath'; title = 'Bath'; items = @(
    'Oak Vanity Storage', 'Waffle Towel Set', 'Stone Soap Dispenser', 'Rounded Bath Mirror', 'Bath Mat Set',
    'Teak Shower Bench', 'Linen Bathrobe', 'Ceramic Toothbrush Holder', 'Wall Shelf Trio', 'Glass Canister Set',
    'Ribbed Cotton Towels', 'Spa Tray', 'Metal Towel Ladder', 'Soft Bath Rug', 'Countertop Organizer',
    'Aroma Diffuser', 'Matte Soap Tray', 'Bathroom Caddy', 'Minimal Waste Bin', 'Soft Light Sconce'
  )},
  @{ key = 'outdoor'; title = 'Outdoor'; items = @(
    'Patio Lounge Set', 'Outdoor Dining Table', 'Weatherproof Sofa', 'Bistro Chair Pair', 'Outdoor Rug',
    'Umbrella Shade', 'Teak Side Table', 'Planter Set', 'Garden Lantern', 'String Light Kit',
    'Hammock Chair', 'Outdoor Bench', 'Fire Pit Bowl', 'All-Weather Cushion Set', 'Outdoor Bar Cart',
    'Patio Storage Box', 'Deck Chair', 'Outdoor Ottoman', 'Sun Shade Sail', 'Cement Planter'
  )},
  @{ key = 'office'; title = 'Office'; items = @(
    'Standing Desk', 'Ergonomic Task Chair', 'Wall Mounted Shelf', 'Desk Lamp', 'Cable Organizer',
    'Minimal File Cabinet', 'Wood Desk Organizer', 'Compact Bookcase', 'Felt Desk Pad', 'Monitor Stand',
    'Rolling Storage Cart', 'Wireless Charging Dock', 'Task Stool', 'Corner Desk', 'Soft Desk Chair',
    'Floating Shelf Set', 'Laptop Stand', 'Storage Cubby', 'Pinboard', 'Office Rug'
  )},
  @{ key = 'lighting'; title = 'Lighting'; items = @(
    'Arc Floor Lamp', 'Matte Pendant Light', 'Glass Globe Lamp', 'Ceramic Table Lamp', 'Wall Sconce Pair',
    'LED Strip Light', 'Reading Lamp', 'Brass Desk Lamp', 'Soft Glow Lantern', 'Pendant Trio',
    'Minimal Chandelier', 'Bedroom Sconce', 'Battery Accent Lamp', 'Dimmer Switch Kit', 'Outdoor Wall Light',
    'Linear Pendant', 'Shade Floor Lamp', 'Marble Base Lamp', 'Frosted Globe Pendant', 'Accent Night Light'
  )},
  @{ key = 'storage'; title = 'Storage'; items = @(
    'Modular Bookcase', 'Storage Console', 'Woven Basket Set', 'Wall Shelf Ladder', 'Entryway Cabinet',
    'Underbed Storage', 'Stacked Cubes', 'Glass Front Cabinet', 'Media Console', 'Storage Ottoman',
    'Shoe Rack', 'Coat Stand', 'Floating Shelf Set', 'Utility Cart', 'Storage Bench',
    'Closet Organizer', 'Pantry Rack', 'Drawer Divider Set', 'Sideboard Cabinet', 'Rolling Bin'
  )}
)

$colors = @('sand','warm','cool','alt')
$materials = @('wood','metal','stone','glass','linen','fabric')
$styles = @('modern','japandi','coastal')

function Get-Price($i) {
  $base = 39 + ($i * 11)
  return ('$' + $base)
}

function Get-Rating($i) {
  $rating = 4.5 + (($i % 4) * 0.1)
  return ('{0:N1} ({1})' -f $rating, (240 + ($i * 7)))
}

# Build category.html grid
$gridArticles = New-Object System.Text.StringBuilder
foreach ($cat in $categories) {
  for ($i = 0; $i -lt $cat.items.Count; $i++) {
    $name = $cat.items[$i]
    $color = $colors[$i % $colors.Count]
    $material = $materials[$i % $materials.Count]
    $style = $styles[$i % $styles.Count]
    $price = Get-Price($i)
    $rating = Get-Rating($i)

    [void]$gridArticles.AppendLine(('        <article data-room="{0}" data-style="{1}" data-color="{2}" data-material="{3}">' -f $cat.key, $style, $color, $material))
    [void]$gridArticles.AppendLine(('          <div class="product-image {0}"></div>' -f $color))
    [void]$gridArticles.AppendLine('          <div class="product-meta">')
    [void]$gridArticles.AppendLine(('            <h4>{0}</h4>' -f $name))
    [void]$gridArticles.AppendLine(('            <p>{0} · {1}</p>' -f $price, $rating))
    [void]$gridArticles.AppendLine(('            <span class="pill">{0}</span>' -f $cat.title))
    [void]$gridArticles.AppendLine('          </div>')
    [void]$gridArticles.AppendLine('        </article>')
  }
}

$categoryPath = Join-Path $PWD 'category.html'
$categoryContent = Get-Content $categoryPath -Raw
$categoryReplacement = '<section class="product-grid" data-filter-grid>' + "`r`n" + $gridArticles.ToString() + '      </section>'
$categoryContent = [regex]::Replace(
  $categoryContent,
  '<section class="product-grid" data-filter-grid>.*?</section>',
  $categoryReplacement,
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)
Set-Content -Encoding UTF8 $categoryPath $categoryContent

# Build products.html sections
$sectionBuilder = New-Object System.Text.StringBuilder
foreach ($cat in $categories) {
  [void]$sectionBuilder.AppendLine(('      <section class="product-showcase" id="{0}">' -f $cat.key))
  [void]$sectionBuilder.AppendLine('        <div class="showcase-header">')
  [void]$sectionBuilder.AppendLine('          <div>')
  [void]$sectionBuilder.AppendLine(('            <p class="eyebrow">{0}</p>' -f $cat.title))
  [void]$sectionBuilder.AppendLine(('            <h2>{0} picks</h2>' -f $cat.title))
  [void]$sectionBuilder.AppendLine('          </div>')
  [void]$sectionBuilder.AppendLine(('          <button class="ghost-button">Shop {0}</button>' -f $cat.key))
  [void]$sectionBuilder.AppendLine('        </div>')
  [void]$sectionBuilder.AppendLine('        <div class="product-grid">')
  for ($i = 0; $i -lt $cat.items.Count; $i++) {
    $name = $cat.items[$i]
    $color = $colors[$i % $colors.Count]
    $price = Get-Price($i)
    $rating = Get-Rating($i)
    [void]$sectionBuilder.AppendLine('          <article>')
    [void]$sectionBuilder.AppendLine(('            <div class="product-image {0}"></div>' -f $color))
    [void]$sectionBuilder.AppendLine('            <div class="product-meta">')
    [void]$sectionBuilder.AppendLine(('              <h4>{0}</h4>' -f $name))
    [void]$sectionBuilder.AppendLine(('              <p>{0} · {1}</p>' -f $price, $rating))
    [void]$sectionBuilder.AppendLine(('              <span class="pill">{0}</span>' -f $cat.title))
    [void]$sectionBuilder.AppendLine('            </div>')
    [void]$sectionBuilder.AppendLine('          </article>')
  }
  [void]$sectionBuilder.AppendLine('        </div>')
  [void]$sectionBuilder.AppendLine('      </section>')
  [void]$sectionBuilder.AppendLine('')
}

$productsPath = Join-Path $PWD 'products.html'
$productsContent = Get-Content $productsPath -Raw
$productsContent = [regex]::Replace(
  $productsContent,
  '<section class="product-grid" data-filter-grid>.*?</section>',
  $sectionBuilder.ToString(),
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)
Set-Content -Encoding UTF8 $productsPath $productsContent

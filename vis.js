console.log("vis.js loaded");

//make the bike wheels spin

// variables from index.html
const frontWheel = document.getElementById('front-wheel');
const backWheel = document.getElementById('back-wheel');
const pedalArm = document.getElementById('pedal-arm');

const vizWidth = 900;
const vizHeight = 500;

// function to toggle wheel spin
function toggleSpin() {
  frontWheel.classList.toggle('spinning');
  backWheel.classList.toggle('spinning');
}

// attach click listeners to the pedal
pedalArm.addEventListener('click', toggleSpin);


// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
  const data = await d3.csv("./dataset/videogames_wide.csv");
  return data;
}

fetchData().then(async (data) => {
  //Global Sales by Platform and Genre
  const vlSpec = vl
    .markBar()
    .data(data)
    .transform(
      vl.aggregate([{ op: 'sum', field: 'Global_Sales', as: 'Sales' }]).groupby(['Platform', 'Genre'])
    )
    .encode(
      vl.y().fieldN('Platform').sort('-x').title('Platform'),
      vl.x().fieldQ('Sales').title('Global Sales (Million)'),
      vl.color().fieldN('Genre').title('Genre'),
      vl.tooltip([
        { field: 'Platform', type: 'nominal' },
        { field: 'Genre', type: 'nominal' },
        { field: 'Sales', type: 'quantitative', format: '.2f', title: 'Global Sales (M)' }
      ])
    )
    .width(800)
    .height(vizHeight)
    .title('Global Sales by Platform and Genre')
    .toSpec();

  // Two graphs showing sales over time by platfrom, then genre
  // Top: Area trends by Platform over time
  const byPlatform = vl
    .markArea({ interpolate: 'monotone' })
    .data(data)
    .transform(
      vl.filter('isValid(datum.Year)'),
      vl.aggregate([{ op: 'sum', field: 'Global_Sales', as: 'Sales' }]).groupby(['Year','Platform'])
    )
    .encode(
      vl.x().fieldQ('Year').axis({ tickMinStep: 1 }).title('Year'),
      vl.y().fieldQ('Sales').stack('zero').title('Global Sales (Million)'),
      vl.color().fieldN('Platform').title('Platform'),
      vl.tooltip(['Year','Platform',{ field:'Sales', type:'quantitative', format:'.2f'}])
    )
    .width(800)
    .height(320)
    .title('Global Sales Over Time — Platform Trends');

  // Bottom: Line trends by Genre over time
  const byGenre = vl
    .markLine({ point: true })
    .data(data)
    .transform(
      vl.filter('isValid(datum.Year)'),
      vl.aggregate([{ op: 'sum', field: 'Global_Sales', as: 'Sales' }]).groupby(['Year','Genre'])
    )
    .encode(
      vl.x().fieldQ('Year').axis({ tickMinStep: 1 }).title('Year'),
      vl.y().fieldQ('Sales').title('Global Sales (Million)'),
      vl.color().fieldN('Genre').title('Genre'),
      vl.tooltip(['Year','Genre',{ field:'Sales', type:'quantitative', format:'.2f'}])
    )
    .width(800)
    .height(320)
    .title('Global Sales Over Time — Genre Trends');

  // Stacking the two graphs
  const vlSpec2 = vl.vconcat(byPlatform, byGenre)
    .resolve({ scale: { color: 'independent' } })   // separate color legends
    .toSpec();

  // Bubble matrix comparing platform sales and region
  const vlSpec3 = vl
    .markCircle({ color: "darkorange"})
    .data(data)
    .transform(
      vl.fold(['NA_Sales','EU_Sales','JP_Sales','Other_Sales']).as(['Region','Sales']),
      vl.aggregate([{ op:'sum', field:'Sales', as:'Total' }]).groupby(['Platform','Region'])
    )
    .encode(
      vl.y().fieldN('Platform').sort('-x').title('Platform'),
      vl.x().fieldN('Region').title('Region').sort(['NA_Sales','EU_Sales','JP_Sales','Other_Sales']),
      vl.size().fieldQ('Total').title('Total Sales (M)'),
      vl.tooltip([
        { field: 'Platform', type: 'nominal' },
        { field: 'Region', type: 'nominal' },
        { field: 'Total', type: 'quantitative', title: 'Sales (M)', format: '.2f' }
      ])
    )
    .width(800)
    .height({ step: 22 })
    .title('Sales by Platform and Region')
    .toSpec();

  // Scatter plot comparing Japan vs. Global sales by genre
  const vlSpec4 = vl
    .markCircle({ opacity: 0.9 })
    .data(data)
    .transform(
      vl.aggregate([
        { op: 'sum', field: 'Global_Sales', as: 'Global' },
        { op: 'sum', field: 'JP_Sales', as: 'Japan' }
      ]).groupby(['Name','Genre'])
    )
    .encode(
      vl.x().fieldQ('Global').title('Global Sales (M)'),
      vl.y().fieldQ('Japan').title('Japan Sales (M)'),
      vl.color().fieldN('Genre').title('Genre'),
      vl.tooltip(['Name','Genre',{ field:'Global', type:'quantitative', format:'.2f' },
                  { field:'Japan', type:'quantitative', format:'.2f' }])
    )
    .width(800)
    .height(450)
    .title('Japan vs Global Sales by Genre')
    .toSpec();

  render("#view", vlSpec);
  render("#view2", vlSpec2);
  render("#view3", vlSpec3);
  render("#view4", vlSpec4);

});

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}

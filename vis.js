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
  const vlSpec = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Platform").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum"),
      vl.tooltip([
        vl.fieldN("Platform"),
        vl.fieldQ("Global_Sales")
      ])
    )
    .width(vizWidth)
    .height(vizHeight)
    .toSpec();

  const vlSpec2 = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Genre").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum"),
      vl.color().value("teal")
    )
    .width(870)
    .height(vizHeight)
    .toSpec();

  const vlSpec3 = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Genre").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum"),
      vl.color().value("red")
    )
    .width(870)
    .height(vizHeight)
    .toSpec();

  const vlSpec4 = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Genre").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum"),
      vl.color().value("yellow")
    )
    .width(870)
    .height(vizHeight)
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

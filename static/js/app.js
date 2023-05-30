// Retrieve JSON file's URL
const samplesURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log to inspect data
d3.json(samplesURL).then(function(data) {
  // console.log(data);
});

function init() {

  // Select dropdown menu from index.html
    var selector = d3.select("#selDataset");
  
    d3.json(samplesURL).then(function(data){
      
      // Assign names to variable
      var sampleNames = data.names;

      // Append each sample's name to dropdown menu for selection
      sampleNames.forEach((sample) => {
        selector
        .append("option")
        .text(sample)
        .property("value", sample);
      });
      
      // Assign first sample to variable to pass along to other functions

      var firstSample = sampleNames[0];

      // Send first sample to functions for chart creation and displaying its info
      createCharts(firstSample);
      showMetadata(firstSample);

    });
  }
  
  init();
   
  function createCharts(sample) {

    d3.json(samplesURL).then(function(data){

      // Assign data samples and its rows to variables
        
      var sampleData = data.samples;
      var sampleRow = sampleData.filter(row => row.id == sample);
        
      // Assign first sample row to variable
      var thisSample = sampleRow[0];

      // Assign current sample's value, otu_id and otu_label to variables
      var sample_values = thisSample["sample_values"];
      var otu_ids = thisSample["otu_ids"];
      var otu_labels = thisSample["otu_labels"];
        
      // Retrieve top 10 and reverse order to show descending order
      var sample_values_10 = sample_values.slice(0, 10).reverse();
      var otu_ids_10 = otu_ids.slice(0, 10).reverse().map(val => `OTU ${val}`);
      var labels = otu_labels.slice(0, 10).reverse();
  
      // Horizontal Chart data for Top 10
      var barData = [
        {
          x: sample_values_10,
          y: otu_ids_10,
          text: labels,
          type: "bar",
          orientation: "h"
        }
      ];

      // Title for bar graph
      var barLayout = {
        title: "Top 10 OTUs Found",
      };

      // Plot horizontal bar
      Plotly.newPlot("bar", barData, barLayout);
  
      //  Bubble Chart data
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
         }
      }];
    
      // Title for bubble graph
      var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        xaxis: { title: "OTU ID" },
        hovermode: "closest"
      };
    
      // Plot bubble graph
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    });
  }

// Metadata Information Panel 
function showMetadata(sample) {
    d3.json(samplesURL).then(function(data){

      // Assign metadata to variable
      var metadata = data.metadata;
      var sampleRow = metadata.filter(row => row.id == sample);
      var thisSample = sampleRow[0];

      // Select #sample-metadata from index.html where info will be entered in
      var html = d3.select("#sample-metadata");

      // Append each key & value into html (#sample-metadata)
      Object.entries(thisSample).forEach(([key, value]) => {
        html
        .append("h6")
        .text(`${key.toUpperCase()}: ${value}`)
      });
  
    });
  }

  // Function to update charts and metadata based on user selection
  function optionSelect(newSample) {

    createCharts(newSample);
    showMetadata(newSample);
    
  }

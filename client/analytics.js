


$(document).ready(function() {



  var completedTodosTotalChart = new CanvasJS.Chart("completedTodosTotal",
  	{
  		theme: "theme2",
  		title:{
  			text: "Total Completed Todos For All Users"
  		},
  		data: [
  		{
  			type: "pie",
  			showInLegend: true,
  			toolTipContent: "{y} - #percent %",
  			yValueFormatString: "#0.#,,.",
  			legendText: "{indexLabel}",
  			dataPoints: [
  				{  y: 4, indexLabel: "Done" },
  				{  y: 7, indexLabel: "Not Completed" },
  			]
  		}
  		]
  	});


    var updateCompletedTodosTotalChart = function() {
      $.getJSON("analytics?type=completedTodosTotal"  , function(data) {
        if (data.status === 200) {
          completedTodosTotalChart.data[0].dataPoints[0].y = data.completed;
          completedTodosTotalChart.data[0].dataPoints[1].y = data.notcompleted;

        }
      });
      completedTodosTotalChart.render();
    }


    var updateCharts = function() {
      updateCompletedTodosTotalChart();
    }


  //Set charts correctly for the first time
  updateCharts();


  setInterval(function() {
    updateCharts();
  }, 2000);

});

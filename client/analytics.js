


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
  			yValueFormatString: "# todo items",
  			legendText: "{indexLabel}",
  			dataPoints: [
  				{  y: 0, indexLabel: "Done" },
  				{  y: 0, indexLabel: "Not Completed" }
  			]
  		}
  		]
  	});

    var todosPerUserChart = new CanvasJS.Chart("todosPerUser", {
				title: {
					text: "Number of todo items per user, Top 10"
				},
				data: [{
					type: "column",
					dataPoints: [
          {  y: 0, indexLabel: "First" },
          {  y: 0, indexLabel: "Second" },
          {  y: 0, indexLabel: "Third" },
          {  y: 0, indexLabel: "4th" },
          {  y: 0, indexLabel: "5th" },
          {  y: 0, indexLabel: "6th" },
          {  y: 0, indexLabel: "First" },
          {  y: 0, indexLabel: "First" },
          {  y: 0, indexLabel: "First" },
          {  y: 0, indexLabel: "First" }
					]
				}]
			});

      var updateTodosPerUser = function() {
        $.getJSON("analytics?type=todosPerUser"  , function(data) {
          if (data.status === 200) {

            //empty the datapoints first
            //todosPerUserChart.data[0].dataPoints = [];

            for (i = 0; i < data.list.length; i++) {
              var newDataPoint = {};

              newDataPoint.y = data.list[i]['COUNT(*)'];
              newDataPoint.label = data.list[i].username;
              todosPerUserChart.data[0].dataPoints[i].y = data.list[i]['COUNT(*)'];
              todosPerUserChart.data[0].dataPoints[i].label = data.list[i].username;
            }

          }
        });
        todosPerUserChart.render();
      }

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
      updateTodosPerUser();
    }


  //Set charts correctly for the first time
  updateCharts();


  setInterval(function() {
    updateCharts();
  }, 2000);

});

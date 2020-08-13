let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let data
let tempData
let baseTemp

let req = new XMLHttpRequest
req.open('GET',url,true)
req.onload = () =>{
    data = JSON.parse(req.responseText)
    tempData = data['monthlyVariance']
    baseTemp = data['baseTemperature']
    console.log(tempData)
    console.log(data)
    drawCanverse()
    genarateScales()
    drawAxis()
    drawData()    
                              
}
req.send()

let width = 1500
let height = 600
let padding = 60

let xAxisScale
let yAxisScale
let widthScale
let heightScale

let drawCanverse = () =>{
    d3.select('#canverse').attr('height',height).attr('width',width)
}

let genarateScales = () =>{

    xAxisScale = d3.scaleLinear()
                   .domain([d3.min(tempData, (object) =>{
                       return object['year']
                   }),d3.max(data['monthlyVariance'], (object) =>{
                    return object['year']+1
                })])
                   .range([padding,width-padding])

    yAxisScale = d3.scaleTime()
                   .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
                   .range([padding,height-padding])  
} 

let drawAxis = () =>{
    
    let xAxis = d3.axisBottom(xAxisScale)
                  .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yAxisScale)
                  .tickFormat(d3.timeFormat('%B'))

    let svg = d3.select('#canverse')

    svg.append('g')         
    .call(xAxis)
    .attr('id','x-axis')
    .attr('transform','translate(0,'+(height-padding)+')')

    svg.append('g')         
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform','translate('+(padding)+',0)')

}

let drawData = () =>{

    let svg = d3.select('#canverse')

    let tooltip = d3.select('#tooltip')
                    .style('visibility','hidden')
                    .style('width','auto')
                    .style('height','auto')
      
    svg.selectAll('rect')
      .data(tempData)
      .enter()
      .append('rect')
      .attr('class','cell')
      .attr('fill',(object) =>{
          if (object.variance > 1){
              return 'maroon'
          }else if(object.variance > 0){
              return 'red'
          }else if(object.variance > -1){
              return 'orange'
          }else if(object.variance > -2){
              return 'yellow'
          }else{
              return 'green'
        }
      })
      .attr('data-month',(object) =>{
        return object['month']-1
      })
      .attr('data-year',(object) =>{
          return object['year']
      })
      .attr('data-temp',(object) =>{
          return baseTemp + object['variance']
      })
      .attr('width', (width - (2*padding))/(d3.max(tempData,(d) =>{return d['year']})-d3.min(tempData,(d) =>{return d['year']})))
      .attr('height', (height-(2*padding))/12)
      .attr('y',(object) =>{
          return yAxisScale(new Date(0,object['month']-1,0,0,0,0,0))
      })
      .attr('x',(object) =>{
          return xAxisScale(object['year'])
      })
      .on('mouseover',(object)=>{
        tooltip.transition()
        .style('visibility','visible')

        var month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

        tooltip.text('Date - '+object['year'] +' '+month[object['month']-1] +' || Temperature = '+ (object['variance']+baseTemp).toFixed(2)+'℃')
        tooltip.attr('data-year', object['year'])
      })
      .on('mouseout',(object)=>{
        tooltip.transition()
        .style('visibility','hidden')})
        
}

document.getElementsByClassName('legend-rect')[0].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' - Above 9.66℃')
})

document.getElementsByClassName('legend-rect')[1].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' - 8.66℃ - 7.66℃')
})

document.getElementsByClassName('legend-rect')[2].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' - 7.66℃ - 6.66℃')
})
document.getElementsByClassName('legend-rect')[3].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' - 6.66℃ - 5.66℃')
})
document.getElementsByClassName('legend-rect')[4].addEventListener('mouseover',()=>{
    document.getElementById('legend-description').innerHTML=(' - Less than 5.66℃')
})

document.getElementById('legend').addEventListener('mouseout',()=>{
    document.getElementById('legend-description').innerHTML=(' - Mouse over for Description')
})

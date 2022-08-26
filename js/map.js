;(() => {
  const center = [-119.41793, 36.778259]
  const width = 600
  const height = 900
  const soCalColor = 'blue'
  const mutedColor = 'grey'

  let spot = null
  let you = null

  const svg = d3
    .select('#map')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('overflow', 'visible')
    .append('g')

  const projection = d3
    .geoMercator()
    .center(center)
    .scale(3200)
    .translate([width / 2, height / 2])

  const geoGenerator = d3.geoPath().projection(projection)

  const defs = svg.append('defs')

  var gradient = defs
    .append('linearGradient')
    .attr('id', 'soCalGradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '0%')
    .attr('y2', '100%')

  const top = gradient
    .append('stop')
    .attr('class', 'start')
    .attr('offset', '50%')
    .attr('stop-color', 'transparent')
    .attr('stop-opacity', 1)

  const keySize = 25
  svg
    .append('rect')
    .attr('width', keySize)
    .attr('height', keySize)
    .attr('x', width - keySize)
    .attr('y', keySize + 100)
    .attr('fill', soCalColor)
    .style('stroke', '#000')
    .style('stroke-width', '3px')

  svg
    .append('text')
    .text('SoCal')
    .attr('x', width - keySize * 4)
    .attr('y', keySize + 100)
    .attr('dy', '1em')
    .style('font-size', '1em')

  const instructions = svg
    .append('text')
    .text('Tap where you live')
    .attr('x', width / 1.5)
    .attr('y', height / 3)
    .attr('dy', '1em')
    .style('font-size', '1em')

  const bottom = gradient
    .append('stop')
    .attr('class', 'end')
    .attr('offset', '50%')
    .attr('stop-color', soCalColor)
    .attr('stop-opacity', 1)

  const state = svg
    .selectAll('path')
    .attr('class', 'california')
    .data(window._california.features)
    .join('path')
    .attr('d', geoGenerator)
    .style('fill', mutedColor)
    .style('stroke', '#000')
    .style('stroke-width', '3px')
    .style('cursor', 'pointer')

  const orangeCounty = svg
    .append('g')
    .selectAll('path')
    .data(window._orangeCounty.features)
    .join('path')
    .attr('d', geoGenerator)
    .style('fill', mutedColor)
    .style('stroke', 'transparent')
    .style('stroke-width', '0px')

  const setSpot = (cursor, showYou) => {
    if (spot) {
      spot.attr('cx', cursor[0]).attr('cy', cursor[1])
    } else {
      spot = svg
        .append('circle')
        .attr('cx', cursor[0])
        .attr('cy', cursor[1])
        .attr('r', 10)
        .style('fill', 'red')
    }
    if (showYou && you) {
      you.attr('x', cursor[0] - 60).attr('y', cursor[1])
    }
    if (showYou && !you) {
      you = svg
        .append('text')
        .text('you →')
        .attr('x', cursor[0] - 60)
        .attr('y', cursor[1])
        .attr('dy', '0.4em')
        .style('font-size', '0.8em')
    }
  }

  svg.on('click', (event) => {
    instructions.remove()
    state.style('fill', 'url(#soCalGradient)')
    orangeCounty.style('fill', soCalColor)
    const offset = ((event.offsetY - 90) / height) * 100 + '%'
    bottom.attr('offset', offset)
    top.attr('offset', offset)
    const cursor = d3.pointer(event)
    setSpot(cursor, true)
  })
})()

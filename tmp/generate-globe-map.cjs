const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync('tmp/ne-110m-land.geojson', 'utf8'));
const width = 1024;
const height = 512;
const tolerance = 0.22;
function distanceToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}
function simplify(points, epsilon) {
  if (points.length <= 4) return points;
  const kept = new Uint8Array(points.length);
  kept[0] = kept[points.length - 1] = 1;
  const ranges = [[0, points.length - 1]];
  while (ranges.length) {
    const [start, end] = ranges.pop();
    let farthest = epsilon;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const distance = distanceToSegment(points[i], points[start], points[end]);
      if (distance > farthest) { farthest = distance; index = i; }
    }
    if (index !== -1) { kept[index] = 1; ranges.push([start, index], [index, end]); }
  }
  return points.filter((_, index) => kept[index]);
}
function toPath(ring) {
  const points = simplify(ring, tolerance);
  return points.map(([lon, lat], index) => {
    const x = ((lon + 180) / 360 * width).toFixed(1);
    const y = ((90 - lat) / 180 * height).toFixed(1);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ') + 'Z';
}
const paths = [];
for (const feature of data.features) {
  const geometry = feature.geometry;
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of polygons) for (const ring of polygon) paths.push(toPath(ring));
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img"><title>Natural Earth land dots</title><desc>Land outlines from the public domain Natural Earth 1:110m dataset, stylized as a dotted globe texture.</desc><defs><pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.15" fill="#a8f1d0" fill-opacity=".9"/></pattern></defs><path d="${paths.join(' ')}" fill="url(#dots)" stroke="#c6f6e1" stroke-opacity=".58" stroke-width=".9" fill-rule="evenodd"/></svg>`;
fs.writeFileSync('public/images/globe-land-dots.svg', svg);
console.log(`wrote ${svg.length} bytes from ${paths.length} rings`);

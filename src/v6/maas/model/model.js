const turf = require("@turf/turf")
const clusterize = require('./clusterize')
function convex_from_points(points) {
    const _clusters = clusterize({data: points, k: 1, err: 0.01})
        .map(cluster => {
            return turf.convex(turf.featureCollection(cluster.map(point => {
                if (point){
                    return turf.point(point.geometry.coordinates)
                }
            })))
        })
    return {cluster: _clusters};
}

module.exports = convex_from_points

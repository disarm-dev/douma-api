const turf = require("@turf/turf")
const clusterize = require('./clusterize')
function convex_from_points(points) {
    const _clusters = clusterize({data: points, k: 1, err: 0.01})
        .map(cluster => {
            const convex_hull = turf.convex(turf.featureCollection(cluster.map(point => {
                if (point){
                    return turf.point(point.geometry.coordinates)
                }
            })))
            convex_hull.cases = cluster.length
            delete convex_hull.properties
            delete convex_hull.type
            return convex_hull
        })

    return {cluster: _clusters};
}

module.exports = convex_from_points

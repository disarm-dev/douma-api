const kmeans = require('ml-kmeans');

function vectorize_feature_data(data) {
    return data.map(feature => feature.geometry.coordinates)
}

function clusterize({data, k, err}) {
    let clusters = []
    let ans = kmeans(vectorize_feature_data(data), k);
    let good_indexes = get_good_clusters_indexes(ans.centroids, err)
    let bad_indexes = get_bad_clusters_indexes(ans.centroids, err)

    for (i of good_indexes) {
        let good_cluster = get_cluster_by_index(i, ans.clusters, data)
        clusters.push(good_cluster)
    }

    for (i of bad_indexes) {
        const bad_cluster = get_cluster_by_index(i, ans.clusters, data)
        const split_clusters = clusterize({data: bad_cluster, k: 2, err: err})
        clusters = clusters.concat(split_clusters)
    }
    return clusters
}

function get_cluster_by_index(i, clusters, data) {
    let _cluster = []

    clusters.forEach((cluster, index) => {
        if (cluster === i) _cluster.push(data[index])
    })
    return _cluster
}


function get_bad_clusters_indexes(centroids, err) {
    return centroids.map((c, i) => c.error > err ? i : -1).filter(i => i > -1)
}

function get_good_clusters_indexes(centroids, err) {
    return centroids.map((c, i) => c.error < err ? i : -1).filter(i => i > -1)
}

module.exports = clusterize
function optionsMiddleware(req, res, next) {
    console.log('🚨 Check if user is authenticated, authorised, or has ANY permissions to do ANYTHING')

    // Must have a country (though need to TODO: @refac Rename to instance_slug or similar)
    if (!req.query.country) {
        res.status(400).send('Country parameter missing')
    } else {
        req.country = req.query.country

        // check if personalised_instance_id or set to default
        req.personalised_instance_id = req.query.personalised_instance_id || 'default'

        next()
    }
}

module.exports = {
    optionsMiddleware,
}

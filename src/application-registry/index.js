const waterline = require('waterline')
const sails_mongo = require('sails-mongo')
//const {login} = require('./routes/login')
const auth = require('./lib/auth')

let orm
(async () => await get_orm())()

function get_orm() {
    return new Promise((resolve, reject) => {
        if (orm) {
            resolve(orm)
        } else {
            waterline.start({
                adapters: {
                    'sails-mongo': sails_mongo,
                },

                datastores: {
                    default: {
                        adapter: 'sails-mongo',
                        url: process.env.MONGODB_URI
                    }
                },

                models: {
                    config: {
                        primaryKey: '_id',
                        dontUseObjectIds: true,
                        datastore: 'default',
                        attributes: {
                            config_data: {type: 'json', required: true},
                            _id: {type: 'string'}
                        }
                    },
                    geojson: {
                        primaryKey: '_id',
                        dontUseObjectIds: true,
                        datastore: 'default',
                        attributes: {
                            geojson_data: {type: 'json', required: true},
                            _id: {type: 'string'}
                        }
                    }
                },

                defaultModelSettings: {
                    //  primaryKey: 'id',
                    //  datastore: 'default',
                    //  attributes: {
                    //      id: { type: 'number', autoMigrations: { autoIncrement: true } },
                    //   },
                }

            }, (err, _orm) => {
                if (err) {
                    if (orm) resolve(orm)
                    return
                }
                orm = _orm
                resolve(orm)
            })

        }
    })
}



function attach_waterline_to_express(app) {

    const version_path_regex = new RegExp('/api/')

    //console.log(version_path_regex)

    const v = p => '/v7'+p;
    auth.updateUserList()

    app.use(/\/api\/.*/, auth.authMiddleware)
    app.use(/\/api\/.*/, auth.endpointPermissionsMiddleware)
    app.use(/\/api\/.*/, auth.optionsMiddleware)

    auth.addPermission('post','/api/config',['write:config'])
    auth.addPermission('put','/api/config',['write:config'])
    auth.addPermission('post','/api/geojson',['write:config'])
    app.post('/api/config', (req, res) => {
        waterline.getModel('config', orm)
            .create({_id: req.body.config_data.config_id, config_data: req.body.config_data})
            .meta({fetch: true})
            .catch({name: 'UsageError'}, function (err) {
                return res.sendStatus(400);
            })
            .catch({name: 'AdapterError', code: 'E_UNIQUE'}, function (err) {
                return res.status(401).json(err);
            })
            .catch(function (err) {
                return res.sendStatus(500);
            })
            .then(function (newRecord) {
                return res.status(201).json(newRecord);
            });
    })



    app.post('/api/geojson', (req, res) => {
        //  console.log('Deprectaed Post Geojson',req.body.geojson_id)
        waterline.getModel('geojson', orm)
            .create({_id: req.body.geojson_id, geojson_data: req.body})
            .meta({fetch: true})
            .then(function (newRecord) {
               // console.log(newRecord)
                return res.status(201).json(newRecord);
            })
            .catch({name: 'UsageError'}, function (err) {
                return res.status(500).send(err);
            })
            .catch({name: 'AdapterError', code: 'E_UNIQUE'}, function (err) {
                return res.status(401).json(err);
            })
            .catch(function (err) {
                return res.sendStatus(500);
            })
        ;
    })

    app.post('/api/geojson/:instance/:spatial_hierarchy', async (req, res) => {
        let _id = `${req.params.instance}/${req.params.spatial_hierarchy}`
        await clear_geojson_by_id(_id)
        waterline.getModel('geojson', orm)
            .create({_id, geojson_data: req.body})
            .meta({fetch: true})
            .then(function (newRecord) {
                //  console.log(newRecord)
                return res.status(201).json(newRecord);
            })
            .catch({name: 'UsageError'}, function (err) {
                return res.status(500).send(err);
            })
            .catch({name: 'AdapterError', code: 'E_UNIQUE'}, function (err) {
                console.log(err)
                return res.status(401).json(err);
            })
            .catch(function (err) {
                return res.sendStatus(500);
            })
        ;
    })

    app.get('/api/config', (req, res) => {
        waterline.getModel('config', orm)
            .find().exec(function (err, records) {
            if (err) {
                switch (err.name) {
                    case 'UsageError':
                        return res.sendStatus(400);
                    default:
                        return res.sendStatus(500);
                }
            } else if (records) {
                return res.json(records.map(r => {
                    return {config_id: r.config_data.config_id, config_version: r.config_data.config_version}
                }));
            }
        });
    })

    //app.get('/api/config/:config_id')

    app.get('/api/geojson', (req, res) => {
        // console.log('Get Geojson')
        waterline.getModel('geojson', orm)
            .find().exec(function (err, records) {
            if (err) {
                switch (err.name) {
                    case 'UsageError':
                        return res.sendStatus(400);
                    default:
                        return res.sendStatus(500);
                }
            } else if (records) {
                return res.json(records);
            }
        });
    })

    app.get('/api/config/:config_id', (req, res) => {
        [config_id,config_version] = req.params.config_id.split('@')
        console.log('Config ID',config_id)
        console.log('Config Version',config_version)
        const query = {}
        if(config_id){
            query._id = config_id
        }
        if(config_version){
            query.config_version=config_version
        }
        waterline.getModel('config', orm)
            .findOne({...query}, function (err, record) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err && err.name === 'AdapterError' && err.code === 'E_UNIQUE') {
                    return res.status(401).json(err);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.json(record);
                }
            });
    })

    app.get('/api/geojson/:instance/:spatial_hierarchy', (req, res) => {
        waterline.getModel('geojson', orm)
            .findOne({_id: `${req.params.instance}/${req.params.spatial_hierarchy}`}, function (err, record) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err && err.name === 'AdapterError' && err.code === 'E_UNIQUE') {
                    return res.status(401).json(err);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.json(record.geojson_data);
                }
            });
    })


    app.get('/api/geojson/:instance', (req, res) => {
        waterline.getModel('geojson', orm)
            .find({}).exec(function (err, record) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err && err.name === 'AdapterError' && err.code === 'E_UNIQUE') {
                    return res.status(401).json(err);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else {
                    console.log('records length',record.length)
                    return res.json(record.filter(rec => rec._id.startsWith(req.params.instance))
                        .map(rec => rec._id.split('/')[1])

                    )

                }
            });
    })

    app.put('/api/config/:config_id', (req, res) => {
        // console.log('put config', req.params.config_id)
        waterline.getModel('config', orm)
            .update({_id: req.params.config_id})
            .set({config_data: req.body.config_data})
            .meta({fetch: true})
            .exec(function (err, updatedConfigs) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err && err.name === 'AdapterError' && err.code === 'E_UNIQUE') {
                    return res.status(401).json(err);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else if (updatedConfigs.length < 1) {
                    // console.log('updated', updatedConfigs)
                    return res.sendStatus(404);
                }
                else {
                    // console.log('updated', updatedConfigs)
                    return res.status(200).json(updatedConfigs[0]);
                }
            });
    })

    app.put('/api/geojson/:geojson_id', async (req, res) => {

        waterline.getModel('config', orm)
            .update({_id: req.params.geojson_id})
            .set({geojson_data: req.body.geojson_data})
            .meta({fetch: true})
            .exec(function (err, updatedConfigs) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err && err.name === 'AdapterError' && err.code === 'E_UNIQUE') {
                    return res.status(401).json(err);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else if (updatedConfigs.length < 1) {
                    // console.log('updated', updatedConfigs)
                    return res.sendStatus(404);
                }
                else {
                    //  console.log('updated', updatedConfigs)
                    return res.status(200).json(updatedConfigs[0]);
                }
            });
    })

    app.delete('/api/config/:config_id', (req, res) => {
        waterline.getModel('config', orm)
            .destroy({_id: req.params.config_id}, function (err) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.sendStatus(200);
                }
            });
    })

    app.delete('/api/geojson/:geojson_id', (req, res) => {
        waterline.getModel('geojson', orm)
            .destroy({_id: req.params.geojson_id}, function (err) {
                if (err && err.name === 'UsageError') {
                    return res.sendStatus(400);
                }
                else if (err) {
                    return res.sendStatus(500);
                }
                else {
                    return res.sendStatus(200);
                }
            });
    })


  //  app.post('/login',login)


    return this;
}


let clearModel = () => {
    //console.log('In clearModel')
    if (!orm) return;
    //console.log('Got orm')
    waterline.getModel('config', orm)
        .destroy({}, (err) => {
            if (err) {
                console.log(err)
                throw(err)
            } else {

                //   console.log('Cleared The model')
            }
        })
}

let clear_geojson = async () => {
    await get_orm()
    return new Promise(((resolve, reject) => {
        waterline.getModel('geojson', orm)
            .destroy({}, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Cleared Geojsons')
                }
            })
    }))

}

let clear_geojson_by_id = async (id) => {
    await get_orm()
    return new Promise((resolve, reject) => {
        if (!orm) return;
        waterline.getModel('geojson', orm)
            .destroy({_id: id}, (err) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                   // console.log('Cleared Single Geojson')
                    resolve('done')
                }
            })
    })
}

let insertData = async (data) => {
    await get_orm()
    if (orm) {
        waterline.getModel('config', orm)
            .create({_id: data.config_id, config_data: data})
            .then(doc => doc)
            .catch(err => err)
    } else {
        //console.log('Not orm')
    }
}

const insert_geojson = async (data) => {
    await get_orm()
    return new Promise(((resolve, reject) => {
            if (orm) {
                waterline.getModel('geojson', orm)
                    .create({_id: 'test_instance/test_level', geojson_data: data})
                    .then(resolve)
                    .catch(reject)
            } else {
                reject('No orm')
            }
        }
    ))

}


module.exports = {
    attach_waterline_to_express,
    clearModel,
    insertData,
    insert_geojson,
    clear_geojson
}


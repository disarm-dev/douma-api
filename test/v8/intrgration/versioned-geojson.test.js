const app =  require('../../../src/api')

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../src/v8/lib/collections')

const novice_key = '04a184f1adf9b44a065d287a5d377284'
const admin_key  = '27599f876ad55a65762b2b9b57f1ba31'

test.beforeEach(async () => {
        await tear_down()
    }
)

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy/version')

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy/version with unauthorised account')

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy/version with invalid geogson')

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy to bump version')

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy to bump version with unauthorised account')

test.todo('Test for saving geodata on /v8/geodata/:instance/:spatial_hierarchy with invalid geojson')

test.todo('Test to list geodata levels and versions for a instance')

test.todo('Test to download a specific version of geodata')

test.todo('Test to download the latest version of geodata for a specific instance and spatial hierarchy level')
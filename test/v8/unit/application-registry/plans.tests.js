import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v8/lib/collections')

const plan = {
    "focus_filter_area": {"id": 8},
    "targets": [{"estimated_rooms": 0, "assigned_to_team_name": null, "id": 377002}, {
        "estimated_rooms": 4560,
        "assigned_to_team_name": null,
        "id": 63
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 100}, {
        "estimated_rooms": 3200,
        "assigned_to_team_name": null,
        "id": 107
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 183}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 192
    }, {"estimated_rooms": 10593, "assigned_to_team_name": null, "id": 239}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 247
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 252}, {
        "estimated_rooms": 759,
        "assigned_to_team_name": null,
        "id": 263
    }, {"estimated_rooms": 325, "assigned_to_team_name": null, "id": 267}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 269
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 270}, {
        "estimated_rooms": 1530,
        "assigned_to_team_name": null,
        "id": 358
    }, {"estimated_rooms": 3631, "assigned_to_team_name": null, "id": 377}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 388
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 393}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 394
    }, {"estimated_rooms": 90, "assigned_to_team_name": null, "id": 412}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 456
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 472}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 474
    }, {"estimated_rooms": 650, "assigned_to_team_name": null, "id": 478}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 501
    }, {"estimated_rooms": 795, "assigned_to_team_name": null, "id": 540}, {
        "estimated_rooms": 0,
        "assigned_to_team_name": null,
        "id": 552
    }, {"estimated_rooms": 1272, "assigned_to_team_name": null, "id": 798}],
    "country": "bwa",
    "id": "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5"
}

test.serial('POST /v8/plan/create config get is open => 200', async t => {
    t.plan(1)
    const res = await request(app).post('/v8/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
    t.is(res.status, 200)
})

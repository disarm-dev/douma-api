const bwa_config = {
    "_id": "bwa@1.0.0",
    "config_id": "bwa",
    "config_version": "1.0.0",
    "applets": {
        "irs_monitor": {
            "season_start_dates": ["2017-10-01", "2018-01-01", "2018-02-01", "2018-03-01"],
            "map": {
                "chart_type": "map",
                "bin_by": "location.selection.id",
                "aggregation_names": ["number of rooms sprayed", "room spray coverage (%)"],
                "property_layers": [{"property": "risk", "label": "Risk"}, {
                    "property": "Num_Rooms",
                    "label": "Number of rooms"
                }],
                "response_point_fields": ["recorded_on", "form_data.number_of_buildings_in_homesteads", "form_data.number_of_rooms", "_decorated.sprayed_status", "form_data.number_sprayed", "form_data.number_of_rooms_not_sprayed"]
            },
            "table": {
                "chart_type": "table",
                "bin_by": "location.selection.id",
                "property_layers": [{"property": "__disarm_geo_name", "label": "Name"}, {
                    "property": "Num_Rooms",
                    "label": "Number of rooms"
                }],
                "aggregation_names": ["number of people in homestead (total)", "number of people in the homestead (<5 yrs)", "number of people in the homestead (>5 yrs)", "number of buildings visited", "number of rooms visited", "number of rooms sprayed", "room spray coverage (%)", "number of rooms sprayed with DDT", "number of rooms sprayed with lambda-cyhalothrin", "number of other structures visited", "Total other structures sprayed", "number of rooms not sprayed", "number of rooms not sprayable (N)", "number of rooms not sprayable (%)", "Number of sprayable rooms not sprayed", "number of rooms not sprayed - locked", "number of rooms not sprayed - locked (%)", "number of rooms not sprayed - nobody", "number of rooms not sprayed - nobody (%)", "number of rooms not sprayed - refusal", "number of rooms not sprayed - refusal (%)", "number of rooms not sprayed - baby", "number of rooms not sprayed - baby (%)", "number of rooms not sprayed - patient", "number of rooms not sprayed - patient (%)", "number of rooms not sprayed - funeral", "number of rooms not sprayed - funeral (%)", "number of rooms not sprayed - kitchen", "number of rooms not sprayed - kitchen (%)", "number of rooms not sprayed - food storage", "number of rooms not sprayed - food storage (%)"]
            },
            "charts": [{
                "id": "variable_definition",
                "chart_type": "text",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "title": "Variable definitions",
                    "text": "**Room**: \nAn enclosed space (e.g. bedrooms, living rooms, kitchen)\n\n**Other structure**: \nBesides rooms, any other structures that are sprayable (e.g. bathrooms, toilets, passages, open-kitchens)\n\n**Building**: \nOne or more conjoined rooms\n\n**Homestead**: \nA yard with one or more buildings\n\n**Household**: \nA group of people who share the same home\n\n**Head of household**: \nAny person responsible for the people who live in a household"
                }
            }, {
                "id": "room_coverage",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "layout": {
                        "showlegend": true,
                        "title": "Room coverage as % of target",
                        "yaxis": {"title": "% coverage"},
                        "xaxis": {"title": "Period commencing"}
                    },
                    "chart_type": "line",
                    "cumulative": true,
                    "time_series": true,
                    "bin_by": "recorded_on",
                    "geographic_level_refactor_this_key_name": "location.selection.id",
                    "multi_series": [{"aggregation_name": "room spray coverage (%)"}]
                }
            }, {
                "id": "spray_status_absolute",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "layout": {
                        "showlegend": true,
                        "title": "Spray status",
                        "yaxis": {"title": "# of households"},
                        "xaxis": {"title": "Spray status"}
                    },
                    "chart_type": "bar",
                    "bin_by": "_decorated.sprayed_status",
                    "single_series": {"aggregation_name": "count"}
                }
            }, {
                "id": "spray_status_pie",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "layout": {"title": "Sprayed status proportion"},
                    "chart_type": "pie",
                    "generate_series_from": "_decorated.sprayed_status"
                }
            }, {
                "id": "room_coverage_by_week",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "chart_type": "bar",
                    "time_series": true,
                    "cumulative": true,
                    "bin_by": "recorded_on",
                    "layout": {
                        "showlegend": true,
                        "title": "Spray room coverage",
                        "yaxis": {"title": "# of rooms"},
                        "xaxis": {"title": "Period commencing"},
                        "barmode": "stack"
                    },
                    "multi_series": [{
                        "aggregation_name": "number of rooms sprayed",
                        "colour": "green"
                    }, {"aggregation_name": "number of rooms not sprayed", "colour": "red"}]
                }
            }, {
                "id": "total_rooms_sprayed_per_week",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "layout": {
                        "showlegend": true,
                        "title": "Total number of rooms sprayed per week",
                        "yaxis": {"title": "# of rooms"},
                        "xaxis": {"title": "Period commencing"}
                    },
                    "chart_type": "bar",
                    "time_series": true,
                    "bin_by": "recorded_on",
                    "multi_series": [{"aggregation_name": "number of rooms sprayed"}]
                }
            }, {
                "id": "spray_status_pie_reason",
                "style": {"height_constraint": "none", "width_constraint": "half"},
                "options": {
                    "layout": {"title": "Refusal reasons for not spraying room"},
                    "chart_type": "pie",
                    "multi_series": [{"aggregation_name": "number of rooms not sprayed - locked"}, {"aggregation_name": "number of rooms not sprayed - nobody"}, {"aggregation_name": "number of rooms not sprayed - refusal"}, {"aggregation_name": "number of rooms not sprayed - baby"}, {"aggregation_name": "number of rooms not sprayed - patient"}, {"aggregation_name": "number of rooms not sprayed - funeral"}, {"aggregation_name": "number of rooms not sprayed - kitchen"}, {"aggregation_name": "number of rooms not sprayed - food storage"}]
                }
            }],
            "title": "Dashboard"
        },
        "irs_plan": {
            "title": "Planning + Management",
            "table_output": [{
                "display_name": "District name",
                "source_field": "name_2"
            }, {
                "display_name": "Village name",
                "source_field": "VILLAGE"
            }, {
                "display_name": "Number of buildings enumerated",
                "source_field": "NumStrct"
            }, {
                "display_name": "Estimated number of rooms",
                "source_field": "Num_Rooms"
            }, {"display_name": "Predicted risk", "source_field": "risk"}]
        },
        "irs_record_point": {"title": "Data Collection + Reporting", "metadata": {"show": true, "optional_fields": []}},
        "meta": {},
        "seasons": {"title": "Admin"},
        "debug": {}
    },
    "map_focus": {"centre": {"lat": -20.37552680342694, "lng": 24.158935546875004}, "zoom": 7},
    "instance": {"title": "Botswana IRS Database", "location_name": "Botswana", "slug": "bwa"},
    "spatial_hierarchy": {
        "data_version": 10,
        "markers": {
            "planning_level_name": "villages",
            "record_location_selection_level_name": "villages",
            "denominator_fields": {"estimated_rooms": "Num_Rooms"}
        },
        "levels": [{
            "field_name": "ID_2",
            "display_field_name": "NAME_2",
            "name": "districts"
        }, {
            "group_by_field": "name_2",
            "field_name": "Id",
            "display_field_name": "VILLAGE",
            "name": "villages"
        }, {"field_name": "ClusterID", "display_field_name": "SP_ID_1", "name": "clusters"}]
    },
    "form": {
        "pages": [{
            "elements": [{
                "type": "radiogroup",
                "choices": [{"value": "yes", "text": "Yes"}, {"value": "no", "text": "No"}],
                "isRequired": true,
                "name": "Mop_up",
                "title": "Is this a mop-up or return visit? "
            }], "name": "Mop up"
        }, {
            "elements": [{
                "type": "text",
                "name": "household_name",
                "title": "Record head of household name(s). (If there is more than one, separate each name with a comma)"
            }], "name": "household"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_of_buildings_in_homesteads",
                "title": "How many buildings are in this homestead?",
                "validators": [{"type": "numeric", "text": "Value must be one or greater", "minValue": 1}]
            }], "name": "buildings count"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_people_homestead",
                "title": "Total Number of People in this Homestead",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_people_homestead_underage5",
                "title": "Number of people in the homestead UNDER the age of 5",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_people_homestead_overage5",
                "title": "Number of people in the homestead at the age of 5 or ABOVE",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }], "name": "people count"
        }, {
            "elements": [{
                "type": "radiogroup",
                "choices": [{"value": "yes", "text": "Yes"}, {"value": "no", "text": "No"}],
                "isRequired": true,
                "name": "LLIN_used_sleeping",
                "title": "Does this homestead have any LLINs used while sleeping?"
            }, {
                "type": "text",
                "isRequired": true,
                "name": "number_LLIN_used",
                "title": "If yes, how many LLINs does the homestead own? ",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}],
                "visible": false,
                "visibleIf": "{LLIN_used_sleeping} = yes"
            }], "name": "pre LLIN"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_of_rooms",
                "title": "How many rooms are in this homestead?  (Count all rooms in all buildings)",
                "validators": [{"type": "numeric", "text": "Minimum value must be one", "minValue": 1}]
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_rooms_modern",
                "title": "How many rooms in this homestead are modern?",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_rooms_traditional",
                "title": "How many rooms in this homestead are traditional?",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_other_structures",
                "title": "How many other structures are in this homestead? (Other structures such as toilets and corridors)",
                "validators": [{"type": "numeric", "text": "Minimum value must be zero"}]
            }], "name": "room count"
        }, {
            "elements": [{
                "type": "radiogroup",
                "choices": [{"value": "yes", "text": "Yes"}, {"value": "no", "text": "No"}],
                "isRequired": true,
                "name": "any_sprayed",
                "title": "Were there any rooms SPRAYED in this homestead?"
            }], "name": "any SPRAYED"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed",
                "title": "How many rooms were sprayed?",
                "validators": [{"type": "numeric", "text": "Minimum value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed_modern_partial_spray",
                "title": "     How many SPRAYED rooms in this homestead are modern?",
                "validators": [{"type": "numeric", "text": "Minimum value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed_traditional_partial_spray",
                "title": "How many SPRAYED rooms in this homestead are traditional?",
                "validators": [{"type": "numeric", "text": "Minimum value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed_other_partial_spray",
                "title": "How many other structures in this homestead were sprayed?",
                "validators": [{"type": "numeric", "text": "Minimum value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }], "name": "SPRAYED details 1", "visible": false, "visibleIf": "{any_sprayed} = 'yes'"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed_ddt",
                "title": "How many rooms in this homestead were sprayed with DDT?  (If none, enter 0)",
                "validators": [{"type": "numeric", "text": "Minimum Value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_sprayed_lambdacyhalothrin",
                "title": "How many rooms in this homestead were sprayed with Lambdacyhalothrin? (If none, enter 0)",
                "validators": [{"type": "numeric", "text": "Minimum Value is 0"}],
                "visible": false,
                "visibleIf": "{any_sprayed} = 'yes'"
            }], "name": "SPRAYED details 2", "visible": false, "visibleIf": "{any_sprayed} = 'yes'"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "number_of_rooms_not_sprayed",
                "title": "How many rooms were NOT sprayed?",
                "validators": [{"type": "numeric", "text": "Minimum Value is 0"}]
            }], "name": "UNSPRAYED details 1"
        }, {
            "elements": [{
                "type": "checkbox",
                "choices": [{"value": "locked", "text": "Locked"}, {
                    "value": "no_one_home",
                    "text": "No one home"
                }, {"value": "hh_refused", "text": "Head of household refused"}, {
                    "value": "newborn",
                    "text": "There is a newborn"
                }, {"value": "funeral", "text": "There is a funeral"}, {
                    "value": "kitchen",
                    "text": "Room is a kitchen"
                }, {"value": "food_store", "text": "Room is a food store"}, {
                    "value": "patient_elderly",
                    "text": "There is a patient in the home"
                }, {"value": "material", "text": "Room was not sprayable due to material (ie canvas)"}],
                "hasOther": true,
                "isRequired": true,
                "name": "unsprayed_reason",
                "title": "Reasons for not spraying rooms"
            }], "name": "UNSPRAYED details 2", "visible": false, "visibleIf": "{number_of_rooms_not_sprayed} > 0"
        }, {
            "elements": [{
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_other",
                "title": "Other reason",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'other'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_patient",
                "title": "There is a patient in the home",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'patient_elderly'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_food",
                "title": "Room is a food store",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'food_store'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_kitchen",
                "title": "Room is a kitchen",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'kitchen'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_funeral",
                "title": "There is a funeral",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'funeral'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_baby",
                "title": "There is a newborn",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'newborn'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_nobody",
                "title": "No one home",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'no_one_home'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "rooms_locked",
                "title": "Locked",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'locked'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_refused",
                "title": "Head of household refused",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'hh_refused'"
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_rooms_material",
                "title": "Room was not sprayable due to material (ie canvas)",
                "visible": false,
                "visibleIf": "{unsprayed_reason} contains 'material'"
            }], "name": "UNSPRAYED details 3", "visible": false, "visibleIf": "{number_of_rooms_not_sprayed} > 0"
        }, {
            "elements": [{
                "type": "radiogroup",
                "choices": [{"value": "yes", "text": "Yes"}, {"value": "no", "text": "No"}],
                "isRequired": true,
                "name": "LLINS_provided",
                "title": "Were LLINs provided to this homestead?” "
            }, {
                "type": "text",
                "inputType": "number",
                "isRequired": true,
                "name": "n_LLINs_given",
                "title": "How many LLINs were given? ",
                "validators": [{"type": "numeric", "text": "Minimum Value is 0"}],
                "visible": false,
                "visibleIf": "{LLINS_provided} = 'yes'"
            }], "name": "UNSPRAYED LLINs"
        }]
    },
    "location_selection": {
        "villages": [{"id": 38, "name": "Suvuyti", "category": "Chobe"}, {
            "id": 377002,
            "name": "SUA PANS",
            "category": "Tutume"
        }, {"id": 34, "name": "CHANGATE", "category": "Tutume"}, {
            "id": 37,
            "name": "Chobe Forest Reserve",
            "category": "Chobe"
        }, {"id": 38002, "name": "Chobe National Park", "category": "Chobe"}, {
            "id": 43,
            "name": "DAGWI",
            "category": "Tutume"
        }, {"id": 63, "name": "DUKWI", "category": "Tutume"}, {
            "id": 100,
            "name": "GOSHWE",
            "category": "Tutume"
        }, {"id": 107, "name": "GWETA", "category": "Tutume"}, {
            "id": 125,
            "name": "Kachikau",
            "category": "Chobe"
        }, {"id": 138, "name": "Kasane", "category": "Chobe"}, {
            "id": 140,
            "name": "Kasane Forest Reserve",
            "category": "Chobe"
        }, {"id": 145, "name": "Kavimba", "category": "Chobe"}, {
            "id": 146,
            "name": "Kazuma Forest Reserve",
            "category": "Chobe"
        }, {"id": 147, "name": "Kazungula", "category": "Chobe"}, {
            "id": 168,
            "name": "Khwai (NG/18 Development Trust)",
            "category": "Ngamiland East"
        }, {"id": 183, "name": "KUTAMOGOREE", "category": "Tutume"}, {
            "id": 192,
            "name": "LEPASHE",
            "category": "Tutume"
        }, {"id": 199, "name": "Lesoma", "category": "Chobe"}, {
            "id": 204,
            "name": "Linyanti",
            "category": "Chobe"
        }, {"id": 220, "name": "Mabele", "category": "Chobe"}, {
            "id": 237,
            "name": "Maikaelelo Forest Reserve",
            "category": "Chobe"
        }, {"id": 239, "name": "MAITENGWE", "category": "Tutume"}, {
            "id": 247,
            "name": "MAKGADIKGADI PAN",
            "category": "Tutume"
        }, {"id": 252, "name": "MAKUTA", "category": "Tutume"}, {
            "id": 263,
            "name": "MANXOTAE",
            "category": "Tutume"
        }, {"id": 267, "name": "MAPOSA", "category": "Tutume"}, {
            "id": 269,
            "name": "MARAPONG",
            "category": "Tutume"
        }, {"id": 270, "name": "MAROBELA", "category": "Tutume"}, {
            "id": 358,
            "name": "MOSETSE",
            "category": "Tutume"
        }, {"id": 377, "name": "NATA", "category": "Tutume"}, {
            "id": 388,
            "name": "NKANGE",
            "category": "Tutume"
        }, {"id": 393, "name": "NSHAKASHOGWE", "category": "Tutume"}, {
            "id": 394,
            "name": "NSWAZWI",
            "category": "Tutume"
        }, {"id": 411, "name": "Pandamatenga", "category": "Chobe"}, {
            "id": 412,
            "name": "PANS CATTLE POST",
            "category": "Tutume"
        }, {"id": 414, "name": "Parakarungu", "category": "Chobe"}, {
            "id": 454,
            "name": "Satau",
            "category": "Chobe"
        }, {"id": 456, "name": "SEBINA", "category": "Tutume"}, {
            "id": 472,
            "name": "SEMITWE",
            "category": "Tutume"
        }, {"id": 474, "name": "SENETE", "category": "Tutume"}, {
            "id": 478,
            "name": "SEPAKO",
            "category": "Tutume"
        }, {"id": 495, "name": "Sibuyu Forest Reserve", "category": "Chobe"}, {
            "id": 501,
            "name": "SOWA TOWN",
            "category": "Tutume"
        }, {"id": 540, "name": "TSOKATSHAA", "category": "Tutume"}, {
            "id": 552,
            "name": "TUTUME",
            "category": "Tutume"
        }, {"id": 563, "name": "WMA A", "category": "Chobe"}, {
            "id": 564,
            "name": "CH/12 Wildlife Utilisation WMA",
            "category": "Chobe"
        }, {"id": 565, "name": "Nungu WMA", "category": "Chobe"}, {
            "id": 569,
            "name": "WMA NG/15 (Linyanti Sable Safaris)",
            "category": "Ngamiland East"
        }, {"id": 798, "name": "ZOROGA", "category": "Tutume"}, {
            "id": 801,
            "name": "Lesoma cattle posts",
            "category": "Chobe"
        }]
    },
    "aggregations": [{
        "name": "room spray coverage (%)",
        "numerator_expr": "number_sprayed",
        "denominator_field": "Num_Rooms"
    }, {
        "name": "number of people in homestead (total)",
        "numerator_expr": "n_people_homestead_underage5 + n_people_homestead_overage5"
    }, {
        "name": "number of people in the homestead (<5 yrs)",
        "numerator_expr": "n_people_homestead_underage5"
    }, {
        "name": "number of people in the homestead (>5 yrs)",
        "numerator_expr": "n_people_homestead_overage5"
    }, {
        "name": "number of buildings visited",
        "numerator_expr": "number_of_buildings_in_homesteads"
    }, {"name": "number of rooms visited", "numerator_expr": "number_of_rooms"}, {
        "name": "number of rooms sprayed",
        "numerator_expr": "number_sprayed"
    }, {
        "name": "number of rooms sprayed with DDT",
        "numerator_expr": "number_sprayed_ddt"
    }, {
        "name": "number of rooms sprayed with lambda-cyhalothrin",
        "numerator_expr": "number_sprayed_lambdacyhalothrin"
    }, {
        "name": "number of other structures visited",
        "numerator_expr": "number_other_structures"
    }, {
        "name": "Total other structures sprayed",
        "numerator_expr": "number_sprayed_other_partial_spray"
    }, {
        "name": "number of rooms not sprayed",
        "numerator_expr": "number_of_rooms_not_sprayed"
    }, {
        "name": "number of rooms not sprayable (N)",
        "numerator_expr": "n_rooms_material"
    }, {
        "name": "number of rooms not sprayable (%)",
        "numerator_expr": "n_rooms_material",
        "denominator_field": "Num_Rooms"
    }, {
        "name": "Number of sprayable rooms not sprayed",
        "numerator_expr": "number_of_rooms_not_sprayed"
    }, {
        "name": "number of rooms not sprayed - locked",
        "numerator_expr": "rooms_locked"
    }, {
        "name": "number of rooms not sprayed - locked (%)",
        "numerator_expr": "rooms_locked",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - nobody",
        "numerator_expr": "n_rooms_nobody"
    }, {
        "name": "number of rooms not sprayed - nobody (%)",
        "numerator_expr": "n_rooms_nobody",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - refusal",
        "numerator_expr": "n_rooms_refused"
    }, {
        "name": "number of rooms not sprayed - refusal (%)",
        "numerator_expr": "n_rooms_refused",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - baby",
        "numerator_expr": "n_rooms_baby"
    }, {
        "name": "number of rooms not sprayed - baby (%)",
        "numerator_expr": "n_rooms_baby",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - patient",
        "numerator_expr": "n_rooms_patient"
    }, {
        "name": "number of rooms not sprayed - patient (%)",
        "numerator_expr": "n_rooms_patient",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - funeral",
        "numerator_expr": "n_rooms_funeral"
    }, {
        "name": "number of rooms not sprayed - funeral (%)",
        "numerator_expr": "n_rooms_funeral",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - kitchen",
        "numerator_expr": "n_rooms_kitchen"
    }, {
        "name": "number of rooms not sprayed - kitchen (%)",
        "numerator_expr": "n_rooms_kitchen",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {
        "name": "number of rooms not sprayed - food storage",
        "numerator_expr": "n_rooms_food"
    }, {
        "name": "number of rooms not sprayed - food storage (%)",
        "numerator_expr": "n_rooms_food",
        "denominator_aggregation": "Number of sprayable rooms not sprayed"
    }, {"name": "count", "numerator_expr": "1"}, {"name": "count", "numerator_expr": "1"}, {
        "name": "count",
        "numerator_expr": "1"
    }, {"name": "count", "numerator_expr": "1"}, {"name": "count", "numerator_expr": "1"}, {
        "name": "count",
        "numerator_expr": "1"
    }, {"name": "count", "numerator_expr": "1"}, {"name": "count", "numerator_expr": "1"}, {
        "name": "count",
        "numerator_expr": "1"
    }, {"name": "count", "numerator_expr": "1"}, {"name": "count", "numerator_expr": "1"}],
    "fake_form": [{
        "Mop_up": "yes",
        "household_name": "name",
        "number_of_buildings_in_homesteads": 3,
        "n_people_homestead": 3,
        "n_people_homestead_underage5": 1,
        "n_people_homestead_overage5": 2,
        "LLIN_used_sleeping": "no",
        "number_of_rooms": 4,
        "number_rooms_modern": 2,
        "number_rooms_traditional": 2,
        "number_other_structures": 0,
        "any_sprayed": "no",
        "number_of_rooms_not_sprayed": 10,
        "unsprayed_reason": ["locked", "kitchen", "newborn", "material"],
        "n_rooms_kitchen": 2,
        "n_rooms_baby": 2,
        "rooms_locked": 4,
        "n_rooms_material": 2,
        "LLINS_provided": "no"
    }, {
        "Mop_up": "no",
        "household_name": "name",
        "number_of_buildings_in_homesteads": 2,
        "n_people_homestead": 4,
        "n_people_homestead_underage5": 2,
        "n_people_homestead_overage5": 2,
        "LLIN_used_sleeping": "no",
        "number_of_rooms": 3,
        "number_rooms_modern": 3,
        "number_rooms_traditional": 0,
        "number_other_structures": 0,
        "any_sprayed": "yes",
        "number_sprayed": 3,
        "number_sprayed_modern_partial_spray": 3,
        "number_sprayed_traditional_partial_spray": 0,
        "number_sprayed_other_partial_spray": 0,
        "number_sprayed_ddt": 2,
        "number_sprayed_lambdacyhalothrin": 1,
        "number_of_rooms_not_sprayed": 0,
        "LLINS_provided": "no"
    }],
    "validations": [{
        "expression": "number_of_rooms_not_sprayed == (rooms_locked + n_rooms_nobody + n_rooms_refused + n_rooms_baby + n_rooms_patient + n_rooms_funeral + n_rooms_kitchen + n_rooms_food + n_rooms_material + n_rooms_other)",
        "message": "Reasons for rooms unsprayed must = total # of rooms unsprayed.",
        "name": "rooms_unsprayed_refusal_count",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "number_of_rooms == (number_rooms_modern + number_rooms_traditional)",
        "message": "Modern + traditional rooms must = total rooms",
        "name": "number_of_rooms",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "n_people_homestead == (n_people_homestead_underage5 + n_people_homestead_overage5)",
        "message": "# of people under 5 + over 5 must = total people",
        "name": "number_of_people",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "n_people_homestead <51",
        "message": "Is this the correct # of people in the homestead? ",
        "name": "max_number_of_people",
        "precondition": "",
        "type": "warning"
    }, {
        "expression": "number_of_rooms < 51",
        "message": "Is this the correct # of rooms in this homestead?",
        "name": "max_number_of_rooms",
        "precondition": "",
        "type": "warning"
    }, {
        "expression": " number_sprayed <= number_of_rooms",
        "message": "# rooms sprayed must be < or = to total # of rooms",
        "name": "numer_of_rooms_sprayed_total",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "number_sprayed_modern_partial_spray <= number_rooms_modern",
        "message": "# sprayed modern rooms must be < or = to total # of modern rooms",
        "name": "number_of_rooms_sprayed_modern",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "number_sprayed_traditional_partial_spray <= number_rooms_traditional",
        "message": "# sprayed traditional rooms must be < or = to total # of traditional rooms",
        "name": "number_of_rooms_sprayed_traditional",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "(number_sprayed_ddt + number_sprayed_lambdacyhalothrin) == number_sprayed",
        "message": "# of rooms sprayed with DDT/Lamda must = total # of rooms sprayed ",
        "name": "number_of_rooms_sprayed_by_insecticide",
        "precondition": "",
        "type": "error"
    }, {
        "expression": "(number_of_rooms_not_sprayed + number_sprayed) == number_of_rooms",
        "message": "sprayed + unsprayed rooms must = total room count",
        "name": "number_of_rooms_sprayed_unsprayed",
        "precondition": "",
        "type": "error"
    }],
    "presenters": {
        "popup_description": [{"title": "Date", "field": "recorded_on"}, {
            "title": "Recorded by",
            "field": "user"
        }, {"title": "Sprayed", "field": "any_sprayed"}, {"title": "Number of people", "field": "n_people_homestead"}]
    },
    "decorators": {
        "status": [{"blue": "n_rooms_material == number_of_rooms"}, {"red": "any_sprayed == 'no'"}, {"yellow": "number_of_rooms > number_sprayed"}, {"green": "number_of_rooms == number_sprayed"}],
        "sprayed_status": [{"not sprayable": "n_rooms_material == number_of_rooms"}, {"not sprayed": "any_sprayed == 'no'"}, {"partial": "number_of_rooms > number_sprayed"}, {"sprayed": "number_of_rooms == number_sprayed"}]
    }
}

module.exports = bwa_config;
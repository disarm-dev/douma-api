# Pre/re-processing geodata

1. Can trigger the rebuilding locally (or maybe remote API call)
1. Doesn't have to live in this repo, probably shouldn't

## So, what is geodata? 

i.e. what are we pre/re-processing?

1. Contains target_areas at different scales (e.g. localities, constituencies, villages, structure-clusters, etc)
1. Need to be able to handle them individually i.e. in parallel, not just in sequence
1. Each target_area should have properties which:
    1. `disarm_parent_area_id`: reference to the parent area - could be empty, which implies it's top-level, or must be "COUNTRY"
    1. `disarm_number_of_structures`: denominator value/s (e.g. number of structures/rooms/households or population)
    1. `disarm_number_of_rooms`

    1. `disarm_max_risk`: some attributes to help prioritisation/selection decision-making: e.g. risk, past activity something
1. Each needs to have a unique ID (in a field which we know) - validate uniqueness?
1. Needs to be valid (against INSTANCE_CONFIG)
1. Needs to be compressed as small as possible
1. Needs to be versioned or dated
1. Needs to be built from a reliable, repeatable source - easily accessible
1. Needs to be named and saved consistently 

### Outputs 
- geodata files with expected/correct attributes
- `location_selection` - list of possible locations (this depends on the _spatial_hierarchy_ level - prob need better naming, or content structure, e.g. `bwa.villages.location_selection.json`)

### Inputs
For each instance, provide or give directions to:

- original geodata files for each level (e.g. villages)
- `instance_config` --> denominator definition
- geospatial source layers (e.g. risk (and what if risk _changes_?!), population, structures, etc)



## What are the related files we're not pre/re-processing in this script? OR What are the other things we want to pre-process?

1. need to validate `validations` against `form` 
  - i.e. check that `validations` only use fields in the `form`
1. need to check `aggregations` against `form`
  - i.e. check that `aggregations` only use fields in the `form`

- `instance_config`
- `form`
- `location_selection`


## Process for one geodata file:
1. Get instance_config from app server: 'https://swz.app-stage.disarm.io/static/instances/swz.instance.json' 
1. Get source geodata file
1. Check source files are valid
1. ~Do whatever combinations are required (where is this defined)~





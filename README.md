# Domestic Energy Performance Certificate (EPC) mapping

![screenshot](https://i.stack.imgur.com/hvvZx.png)

A simple demonstration app which puts data from
[the Ministry of Housing, Communities and Local Government](https://epc.opendatacommunities.org/docs/api/domestic) on a map.

I've used a vanilla Javascript front-end with the mapping done with [Leaflet](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/#map=6/54.910/-3.432) and a Python backend with Flask and the good old `requests` library.

The EPC data doesn't come with any geocoding so after the server has retrieved the data from the UK government, it then makes a bulk request to the fantastic [postcodes.io](http://postcodes.io/). Unfortunately requesting somewhere busy, like a London borough, seems to overwhelm postcodes.io a bit, so I've limited the search results to 50. There is still scope to increase this, but it's currently low to make the thing fast for testing.

## How to run

You need to start a server in the root directory to deal with the Python/Flask back end. This can most easily be done using:

```
FLASK_APP=server.py python -m flask run
```

You might also need to properly serve the front-end (in the `src` folder), since it makes AJAX requests to the server. This is pretty easy with, for example:

```
cd src
python -m http.server
```

(That's for python3. If you've got python 2.7 it's `python -m SimpleHTTPServer` or something similar to that.)

## FAQs

### Why separate client and server? Isn't that over-engineering?

Not really. In the real world, you'd cache the EPC data on the server, rather than having every one of your clients request the data separately from the UK government.

Also, the government's server is not set up to respond to `OPTIONS` HTTP requests, and a browser will send one of these when making an `XMLHttpRequest` to the government's API, because the `Authorization` header is considered non-standard. Read [this](https://stackoverflow.com/a/40373949/2071807) for more information about CORS and why browsers don't like making non-standard Ajax requests.

### Why vanilla javascript and not jQuery (or Angular/React/etc!)

I don't know why, really. I think maybe it's showing off? I don't like using jQuery because I'm some sort of luddite I think. 
More seriously, I think over-engineering is a major problem for a lot of projects, so maybe I wanted to demonstrate that a reasonable amount can be achieved with simple technology.

## Why Python on the backend and not Node.js?

Because I already had Python installed on my Linux and I didn't have Node so I went with Python 3 and Flask. Maybe also something to do with showing off? (See answer above.)

More seriously again, presumably the data science team who will be making modelling predictions using this data will have their model running in Python/Numpy/Scikit Learn. So it makes sense for the whole back end to be running Python rather than a horrible blend of Node.js and Python.

# Smarthome

Centralized system on several ESP8266's.

Nothing works yet, but you can try it [here](https://goo.gl/fBjsck) ¯\\_(ツ)_/¯


## Core http APIs

#### GET: `/q/listdevices`

Get an array of all known devices. E. g.

```
[
    {
        "id": 0,
        "mac": "01:23:45:67:89:ab",
        "title": "Light sensor in bedroom",
        "class": "sensor",
        "inputs": [],
        "outputs: [
            {
                "name": "brightness",
                "to": "bedroom-light-level"
            }
        ]
    },
    {
        "id": 1,
        "mac": "12:34:56:78:90:cd",
        "title": "Lamp in bedroom",
        "class": "light",
        "inputs": [
            {
                "name": "on",
                "from": "bedroom-lamp-state"
            }
        ],
        "outputs: [
            {
                "name": "on",
                "to": "bedroom-lamp-state"
            }
        ]
    }
]
```

#### GET: `/q/listvar`

Get an array of all global variables. E. g.

```
[
    {
        "name": "bedroom-light-level",
        "from": {
            "id": 0,
            "output": "brighness"
        }
    },
    {
        "name": "bedroom-lamp-state",
        "from": {
            "id": 1,
            "output": "on"
        },
        "to": {
            "id": 1,
            "input: "on"
        }
    }
]
```

#### POST `/q/adddevice`

Add a new device to list

##### Post data:
```
{
    "mac": "11:22:33:44",
    "title": "Lamp at desktop",
    "class": "light"
}
```
##### Returned data:
```
{
    "status": "success",
    "id": 2
}
```
##### or
```
{
    "status": "error",
    "decription": "invalid mac"
}
```

#### POST `/q/removedevice`

Remove device from list & delete all dependencies on it

##### Post data:
```
{
    "id": 2
}
```
##### Returned data:
```
{
    "status": "success"
}
```
##### or
```
{
    "status": "error",
    "decription": "no such id"
}
```

#### POST `/q/addvar`

Add new variable to list

##### Post data:
```
{
    "name": "qwerty"
}
```
##### Returned data:
```
{
    "status": "success"
}
```
##### or
```
{
    "status": "error",
    "decription": "already exists"
}
```

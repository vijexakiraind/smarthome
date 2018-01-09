# Smarthome

Centralized system on several ESP8266's.

Nothing works yet, but you can try it [here](https://goo.gl/XWYDJH) ¯\\_(ツ)_/¯

## Core http APIs

### UI Elements

#### GET: `/q/listuis`

Get an array of UI Elements

##### Returned data:

```
{
    "status": "success",
    "data": [
        {
            "title": "Lamp",
            "type": "power-switch",
            "connections": [
                "bedroom-lamp-state"
            ]
        }
    ]
}
```

#### POST: `/q/setuis`

Set an array of UI Elements

##### Post data:

```
[
    {
        "title": "Lamp",
        "type": "power-switch",
        "connections": [
            "bedroom-lamp-state"
        ]
    }
]
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
    "decription": "unknown type"
}
```

### Devices

#### GET: `/q/listdevices`

Get an array of all known devices

##### Returned data:
```
{
    "status": "success",
    "data": [
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
}
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
    "id": "2"
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

#### POST `/q/setdevice`

Edit device data except mac-address

##### Post data:
```
{
    "id": 2,
    "title": "Light sensor in bedroom",
    "class": "sensor",
    "inputs": [],
    "outputs: [
        {
            "name": "brightness",
            "to": "bedroom-light-level"
        }
    ]
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

### Global variables

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

#### POST `/q/removevar`

Delete variable & all its connections

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
    "decription": "no such var"
}
```

#### POST `/q/setvar`

Change variable value

##### Post data:
```
{
    "name": "qwerty",
    "value": 0.19
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
    "decription": "invalid variable name"
}
```

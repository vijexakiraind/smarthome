# Smarthome

Centralized system on several ESP8266's.

Nothing works yet, but you can try it [here](https://goo.gl/XWYDJH) ¯\\_(ツ)_/¯

## Core http APIs

### Connection API

#### GET: `/q/searchfordevices`

Tries to find devices in local network

##### Returned data:
```
{
    "status": "success",
    "data": [
        {
            "check_word": "lamp",
            "ip": "192.168.1.100", 
            "mac": "01:23:45:67:89:ab"
        },
        {
            "check_word": "garland",
            "ip": "192.168.1.123", 
            "mac": "10:32:54:76:98:ba"
        }
    ]
}
```

#### POST `/q/connectdevice`

Add new device to the list and return id

##### Post data:
```
{
    "ip": "192.168.1.100"
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
    "description": "device didn't respond"
}
```

#### POST `/q/disconnectdevice`

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
    "description": "no such id"
}
```

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
    "description": "unknown type"
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
            "outputs": [
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
            "outputs": [
                {
                    "name": "on",
                    "to": "bedroom-lamp-state"
                }
            ]
        }
    ]
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
    "description": "no such id"
}
```

#### POST `/q/getdevice`

Get one device data

##### Post data:
```
{
    "id": 2
}
```
##### Returned data:
```
{
    "status": "success",
    "data": {
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
        "outputs": [
            {
                "name": "on",
                "to": "bedroom-lamp-state"
            }
        ]
    }
}
```
##### or
```
{
    "status": "error",
    "description": "no such id"
}
```

### Global variables

#### GET: `/q/listvar`

Get an array of all global variables

##### Returned data:
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
            "input": "on"
        }
    }
]
```

#### GET: `/q/getvars`

Get an object with global var`s values

##### Returned data:
```
{
    "bedroom-lamp-state": 0,
    "bedroom-light-level": 0
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
    "description": "already exists"
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
    "description": "no such var"
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
    "description": "invalid variable name"
}
```

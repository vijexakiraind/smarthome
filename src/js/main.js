const switch1 = new Switch('switch1')

switch1.ontoggle = sw => console.log(sw.on ? 'Turned on' : 'Turned off')
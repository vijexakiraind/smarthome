export default function ScanForServer(myIp, callback) {
    const ip = myIp.split('.')

    let total = 0
    let res = null
    for(let i = 0; i < 255 && !res; i++) {
        ip[3] = i
        const currIp = ip.join('.')

        const req = new XMLHttpRequest()

        //req.onerror = e => console.log(e)

        req.onreadystatechange = () => {
            console.log(total, req.status )
            if(req.readyState === 4)
                if(req.status === 200) {
                    res = currIp
                    console.log(res)
                    if(++total === 256)
                        console.log('aa')
                }
                else
                    if(++total === 256)
                        console.log('aa')
        }

        req.open('GET', `http://${currIp}:1488/q/ping`, true)

        req.send()

        setTimeout(() => req.abort(), 200)        
    }

    
}
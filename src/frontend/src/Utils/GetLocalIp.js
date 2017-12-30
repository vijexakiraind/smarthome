export default function(callback) {
    const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection

    if (RTCPeerConnection) {
        const rtc = new RTCPeerConnection({ iceServers: [] })

        rtc.createDataChannel('', { reliable: false });
        
        rtc.onicecandidate = evt => {
            if (evt.candidate) grepSDP('a='+evt.candidate.candidate, callback);
        }

        rtc.createOffer(offerDesc => {
            grepSDP(offerDesc.sdp, callback)
            rtc.setLocalDescription(offerDesc)
        }, e => {
            console.warn('offer failed', e)
            callback(true)
        })        
        
        const addrs = Object.create(null)
        addrs['0.0.0.0'] = false
    }
    else {
        callback(true)
    }
}

function grepSDP(sdp, callback) {
    sdp.split('\r\n').forEach(line => {
        if (~line.indexOf('a=candidate')) {
            const parts = line.split(' '),
                  addr = parts[4],
                  type = parts[7]

            if (type === 'host') callback(false, addr);
        }
    });
}
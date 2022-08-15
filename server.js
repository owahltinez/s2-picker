const s2 = require('@radarlabs/s2');
const express = require('express');
const server = express();

// Serve our simple form page by default.
server.use(express.static(__dirname));

// Handle requests for cell coverings.
server.get('/tokens', (req, res) => {
    const params = req.query;

    // Validate that all required parameters are present.
    if (!params.level || !params.latlngs) {
        res.writeHead(400);
        return res.end('Parameters "level" and "latlngs" required.');
    }

    // Process request parameters.
    const level = parseInt(params.level);
    const latlngs = params.latlngs.split(' ').map(latlng => {
        const [lat, lng] = latlng.split(',', 2).map(parseFloat);
        return new s2.LatLng(lat, lng);
    });

    // Compute region covering.
    const covering = s2.RegionCoverer.getCoveringTokens(latlngs, { min: level, max: level });

    // Return cell tokens in response.
    res.send(covering);
});

// Run the server and report out to the logs
server.listen({ port: process.env.PORT, host: "0.0.0.0" });

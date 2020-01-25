const PROXY_CONFIG = [
    {
        context: [
            "/mth-specialschedule"
        ],
        target: "http://localhost:3000",
        secure: false
    },
    {
        context: [
            "/mth-monitoring"
        ],
        target: "http://localhost:3001",
        secure: false
    }
]

/*
,
    {
        context: [
            "/oauth"
        ],
        target: "https://auth.tado.com/",
        secure: true,
        changeOrigin: true,
        logLevel: "debug"
    }
*/
module.exports = PROXY_CONFIG;
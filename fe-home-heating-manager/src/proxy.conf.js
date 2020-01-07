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

module.exports = PROXY_CONFIG;
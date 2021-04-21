const cluster = 'httpd-siab';
const subnets = [
    "subnet-92afc7f4",
];
const securityGroups = [
    "sg-07b0588aee4fe9030",
];

const vulnerabilities = {
    "sql_injection": {
        "taskDefinition": "httpd_siab",
        "cluster": cluster,
        "count": 1,
        "launchType": "FARGATE",
        "networkConfiguration": {
            "awsvpcConfiguration": {
                "subnets": subnets,
                "securityGroups": securityGroups,
                "assignPublicIp": "ENABLED"
            }
        }
    }
}

module.exports = {
    cluster,
    subnets,
    vulnerabilities,
}
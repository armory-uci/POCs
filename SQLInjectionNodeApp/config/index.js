require('dotenv').config({ path: './config/.env' });
const convict = require('convict');

const config = convict({
    env: {
        format: ['prod', 'dev'],
        default: 'dev',
        env: 'NODE_ENV',
        arg: 'nodeEnv'
    },
    port: {
        format: 'port',
        default: 5000,
        env: 'PORT',
        arg: 'port'
    },
    cluster: {
        format: String,
        default: 'default_cluster'
    },
    subnets: {
        format: Array,
        default: []
    },
    vulnerabilities: {
        format: Object,
        default: {}
    }
    // vulnerabilities: '*',
});

const env = config.get('env');
// console.log(JSON.stringify(require(`./${env}`)));
config.load(require(`./${env}`));
// config.loadFile(`./config/${env}.json`)
config.validate()
module.exports = config.getProperties();
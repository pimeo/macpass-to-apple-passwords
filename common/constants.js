// mongo
module.exports.MONGO_DB_HOST = "mongodb://localhost:27017";
module.exports.MONGO_DB_DATABASE_NAME = "cydiscover_nist";
module.exports.MONGO_DB_NIST_CVE_COLLECTION_NAME = "cve";
module.exports.MONGO_DB_NIST_CPE_MATCH_CRITERIA_COLLECTION_NAME = "cpe_match_criteria";
module.exports.MONGO_DB_NIST_CPE_COLLECTION_NAME = "cpe";

// nist
module.exports.NIST_CVE_HOST = "https://services.nvd.nist.gov";
module.exports.NIST_CVE_API_BASE_PATH = "/rest/json/cves/2.0/";
module.exports.NIST_MATCH_CRITERIA_API_BASE_PATH = "/rest/json/cpematch/2.0/";
module.exports.NIST_CPE_API_BASE_PATH = "/rest/json/cpes/2.0/";
module.exports.NIST_CVE_API_KEY = "c4b719a9-500d-4b7b-a423-d6f86ec3f0a3";

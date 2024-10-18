const { MongoClient } = require("mongodb");

/**
 * Setup a new mongo db client connection
 * @returns {MongoClient}
 */
module.exports.setupMongoDbClient = async (url) => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to server");

    return client;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Close a mongo db client connection
 * @param {MongoClient} client
 * @returns
 */
module.exports.closeMongoDbClient = async (client) => {
  try {
    client.close();
    console.log("Connection successfully closed");
  } catch (error) {
    console.error(error);
  }
};

/**
 * Drop mongo db database by name
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 */
module.exports.dropMongoDbDatabase = async (client, databaseName) => {
  try {
    const db = client.db(databaseName);
    await db.dropDatabase();

    console.log(`Dropping database ${databaseName} successful`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Drop mongo db collection by name
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 */
module.exports.dropMongoDbCollection = async (client, databaseName, collectionName) => {
  try {
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    await collection.drop();

    console.log(`Dropping collection ${collectionName} successful`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Create a new clustered collection (replace _id field ObjectID() type by an ISO attribute type)
 * @link https://www.mongodb.com/docs/v6.0/core/clustered-collections/
 * @param {MongoClient} client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {Object} options collection creation extra options
 * @return {Collection} created collection
 */
module.exports.createClusteredCollection = async (client, databaseName, collectionName, options = {}) => {
  const db = client.db(databaseName);
  const collection = await db.createCollection(collectionName, {
    ...options,
    clusteredIndex: {
      key: { _id: 1 },
      unique: true
    }
  });
  return collection;
};

/**
 * Create a new capped collection. Use to limit size or maximum documents and destroy old documents to make space.
 * Capped collections are fixed-size collections that support high-throughput operations that insert and retrieve documents based on insertion order.
 * Capped collections work in a way similar to circular buffers: once a collection fills its allocated space, it makes room for new documents by overwriting the oldest documents in the collection.
 * @link https://www.mongodb.com/docs/v6.0/core/capped-collections/
 * @param {MongoClient} client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {Number} collectionSize collection max size (0 < x > 1024^5 (1PB)). MongoDB rounds the size of all capped collections up to the nearest integer multiple of 256, in bytes
 * @param {Number} maxDocuments max documents
 * @param {Object} options collection creation extra options
 * @return {Promise<Collection>} created collection
 *
 * To change capped collection size: db.runCommand( { collMod: "log", cappedMax: 500 } )
 * To convert a collection to capped: db.runCommand({"convertToCapped": "mycoll", size: 100000});
 * To know if a collection is capped: db.collection.isCapped()
 */
module.exports.createCappeddCollection = async (
  client,
  databaseName,
  collectionName,
  collectionSize = 5242880,
  maxDocuments = 5000,
  options = {}
) => {
  const db = client.db(databaseName);
  const collection = await db.createCollection(collectionName, {
    size: collectionSize,
    max: maxDocuments,
    ...options,
    capped: true
  });

  return collection;
};

/**
 * Insert items into mongo db client collection
 * @param {MongoClient} client
 * @param {String} collectionName collection name
 * @param {Promise<Array>} items
 */
module.exports.insertIntoMongoDb = async (client, databaseName, collectionName, items = []) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const insertResults = await collection.insertMany(items);
  return insertResults;
};

/**
 * Drop mongo db collection by name
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @returns {Promise<Array>} list of indexes
 */
module.exports.listIndexes = async (client, databaseName, collectionName) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const indexes = await collection.listIndexes().toArray();
  return indexes;
};

/**
 * Create single field index.
 * Single field indexes are indexes that improve performance for queries that specify ascending or descending sort order on a single field of a document.
 * @link https://www.mongodb.com/docs/manual/core/indexes/index-types/index-single/
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {Array} fields fields names
 * @param {Number} direction Default: 1. Ascending (1) or descending (-1) sort order
 * @returns {Promise}
 */
module.exports.createSortFieldIndex = async (client, databaseName, collectionName, fields = [], direction = 1) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);
  const results = [];
  for (const field of fields) {
    results.push(await collection.createIndex({ [field]: direction }));
  }

  return results;
};

/**
 * Create a custom field index.
 * Single field indexes are indexes that improve performance for queries that specify ascending or descending sort order on a single field of a document.
 * @example CompoundIndex createCustomIndex(client, 'my_db', 'my_col', {category: 1, genre: -1})
 * @example SingleFieldIndex createCustomIndex(client, 'my_db', 'my_col', {category: 1})
 * @example MultikeyIndex (array field index) createCustomIndex(client, 'my_db', 'my_col', {tags: 1})
 * @example Unique Indexes createCustomIndex(client, 'my_db', 'my_col', {theater_id: 1}, {unique: true})
 * @link https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {Object} fields fields names {my_field_1: 1, my_field_2: -1}
 * @param {Object} options index options
 * @returns {Promise} list of indexes
 */
module.exports.createCustomIndex = async (client, databaseName, collectionName, fields = {}, options = {}) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const results = await collection.createIndex(fields, options);
  return results;
};

/**
 * Create a text index.
 * @link https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {String} field fields attribute. Example: my_field
 * @param {Object} options index options
 * @returns {Promise}
 *
 * createCustomIndex(client, 'my_db', 'my_col', 'my_field_1', { default_language: 'english': weights: { my_field_1: 10 }})
 */
module.exports.createTextIndex = async (client, databaseName, collectionName, field, options = {}) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const results = await collection.createIndex({ [field]: "text" }, options);
  return results;
};

/**
 * Create a search index.
 * @link https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/#search-indexes
 * @param {MongoClient} client mongodb client
 * @param {String} databaseName database name
 * @param {String} collectionName collection name
 * @param {String} field fields attribute. Example: my_field
 * @param {Object} options index options
 * @returns {Promise}
 *
 * createCustomIndex(client, 'my_db', 'my_col', 'my_search_field')
 */
module.exports.createSearchIndex = async (client, databaseName, collectionName, field, options = {}) => {
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  const results = await collection.createSearchIndex({
    definition: {
      mappings: {
        dynamic: true
      }
    },
    ...options,
    name: field
  });
  return results;
};

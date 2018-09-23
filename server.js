const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const moment = require('moment')
var cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Server Connection
const port = process.env.PORT || '8080'
app.set('port', port)
const server = http.createServer(app)
console.log('NODE TIME ===> ' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
server.listen(port, () => console.log(`API running on localhost:${port}`))

app.use(express.static(path.join(__dirname, 'build')));	

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))				
})

// require('dotenv').config({ silent: true });

// // Bootstrap application settings
// require('./config/express')(app);
// const watson = require('watson-developer-cloud');

// const discovery = watson.discovery({
//   username: process.env.MY_DISCOVERY_USERNAME,
//   password: process.env.MY_DISCOVERY_PASSWORD,
//   version: 'v1',
//   version_date: '2017-07-19',
//   url: 'https://gateway.watsonplatform.net/discovery/api',
// });

// var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
// var discoveryv1 = new DiscoveryV1({
//   version: '2018-03-05',
//   username: process.env.MY_DISCOVERY_USERNAME,
//   password: process.env.MY_DISCOVERY_PASSWORD
// });

// const sync = require('synchronize');

// const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
// const toneAnalyzer = new ToneAnalyzerV3({
//   username: process.env.MY_TONE_ANALYZER_USERNAME,
//   password: process.env.MY_TONE_ANALYZER_PASSWORD,
//   version_date: '2016-05-19',
// });

// const MY_ENVIRONMENT_ID = process.env.MY_ENVIRONMENT_ID;
// const MY_COLLECTION_ID = process.env.MY_COLLECTION_ID;

// const MAX_QUERY_NUM = 9999;
// const VISIBLE_NUM = 6;

// // pre-processing
// const preStopWords = ['BRAND', 'hour', 'year', '10', 'help', 'us', 'minute', '%', 'week', 'fail',
//   'day', 'mins', 'twitter', 'https', 'http', 'technical support', 'log file', 'community'];
// const chartFields = [['frustrated', 'sad', 'impolite', 'neutral', 'polite', 'excited', 'satisfied'],
//                    ['frustrated', 'sad', 'impolite', 'non-negative'],
//                    ['frustrated', 'sad', 'impolite', 'neutral', 'polite', 'excited', 'satisfied'],
//                    ['frustrated', 'sad', 'impolite', 'neutral', 'polite', 'excited', 'satisfied'],
// ];

// const toneOrderMap = { frustrated: 3, sad: 2, impolite: 1, neutral: 0, polite: 1, excited: 2, satisfied: 3 };

// // pre-stored data
// const initialEntityMaps = {};
// const initialAgentMap = {};
// let initialEntityList;
// let initialConversations;
// let initialAgents;
// let initialCustomers;

// // core functions

// function getDominantTone(tones) {
//   const keys = Object.keys(tones).sort((a, b) => toneOrderMap[b] - toneOrderMap[a]);
//   if (keys[0] === 'sympathetic') {
//     return keys[1] || 'neutral';
//   }
//   return keys[0] || 'neutral';
// }

// function getScore(tone) {
//   if (tone === 'frustrated') {
//     return 3;
//   } else if (tone === 'sad') {
//     return 2;
//   } else if (tone === 'impolite') {
//     return 1;
//   }
//   return 0;
// }

// function getToneByScore(score) {
//   if (score === 3) {
//     return 'frustrated';
//   } else if (score === 2) {
//     return 'sad';
//   } else if (score === 1) {
//     return 'impolite';
//   }
//   return 'non-negative';
// }

// function voteLastUtteranceTone(conversation, config) {
//   if (config === 'CUSTOMER') {
//     const N = conversation.length;
//     for (let i = N; i >= 1; i -= 1) {
//       const turn = conversation[`Turn${i}`];
//       if (turn.speaker === 'customer') {
//         const tones = turn.tones;
//         return getDominantTone(tones);
//       }
//     }
//   }
// }

// function voteConversationTone(conversation, selectedTones, config) {
//   const N = conversation.length;
//   let highestScore = 0;
//   for (let i = N; i >= 1; i -= 1) {
//     const turn = conversation[`Turn${i}`];
//     if (config === 'CUSTOMER' && turn.speaker === 'customer') {
//       const tones = turn.tones;
//       for (let t = 0; t < Object.keys(tones).length; t += 1) {
//         const score = getScore(Object.keys(tones)[t]);
//         if (score > highestScore) {
//           highestScore = score;
//         }
//       }
//     }
//   }

//   return getToneByScore(highestScore);
// }

// function computeAgentMap(agentMap, queryString, res) {
//   const agentQuery = { query: queryString, count: MAX_QUERY_NUM };

//   agentQuery.environment_id = MY_ENVIRONMENT_ID;
//   agentQuery.collection_id = MY_COLLECTION_ID;
//   // console.log("agentQuery",agentQuery)
//   agentQuery.aggregation = `term(agent_name,count:${VISIBLE_NUM})`;

//   discovery.query(agentQuery, (error, data) => {
//     if (data) {
//       const agentData = data.aggregations[0].results;
//       let agentList = '';
//       const agents = [];
//       for (let i = 0; i < agentData.length; i += 1) {
//         agentList += `${agentData[i].key}|`;
//         agents.push(agentData[i].key);
//       }

//       const conversationQuery = { query: queryString, count: MAX_QUERY_NUM, filter: `agent_name:${agentList.slice(0, -1)}` };
//       conversationQuery.environment_id = MY_ENVIRONMENT_ID;
//       conversationQuery.collection_id = MY_COLLECTION_ID;

//       discovery.query(conversationQuery, (error2, data2) => {
//         if (data2) {
//           const conversationData = data2.results;
//           const fields = chartFields[3];
//           for (let i = 0; i < agents.length; i += 1) {
//             agentMap[agents[i]] = {};
//             for (let f = 0; f < fields.length; f += 1) {
//               agentMap[agents[i]][fields[f]] = 0;
//             }
//           }
//           for (let i = 0; i < conversationData.length; i += 1) {
//             const conversation = conversationData[i];
//             const agent = conversation.agent_name;

//             if (agent) {
//               const dTone = voteLastUtteranceTone(conversation, 'CUSTOMER');
//               if (fields.indexOf(dTone) >= 0) {
//                 agentMap[agent][dTone] += 1;
//               }
//             }
//           }
//           console.log('Finished computing agent map');

//           if (res) { res.end(JSON.stringify(agentMap)); }
//         } else if (res) { res.end(JSON.stringify(agentMap)); }
//       });
//     } else if (res) { res.end(JSON.stringify(agentMap)); }
//   });
// }

// function mapEntities(chartId, data, entityList, entityMap, entityMaps) {
//   if (chartId === 1) {
//     for (let i = 0; i < data.length; i += 1) {
//       const conversation = data[i];
//       if ('enriched_text' in conversation) {
//         const entities = conversation.enriched_text.entities;
//         const tones = conversation.Turn1.tones;
//         const dTone = getDominantTone(tones);
//         for (let e = 0; e < entities.length; e += 1) {
//           const entity = entities[e].text;
//           if (entityList.indexOf(entity) >= 0) {
//             entityMap[entity][dTone] += 1;
//           }
//         }
//       }
//     }
//   } else if (chartId === 2) {
//     for (let i = 0; i < data.length; i += 1) {
//       const conversation = data[i];
//       if ('enriched_text' in conversation) {
//         const entities = conversation.enriched_text.entities;
//         const dTone = voteConversationTone(conversation, chartFields[chartId], 'CUSTOMER');
//         if (dTone !== undefined) {
//           for (let e = 0; e < entities.length; e += 1) {
//             const entity = entities[e].text;
//             if (entityList.indexOf(entity) >= 0) {
//               entityMap[entity][dTone] += 1;
//             }
//           }
//         }
//       }
//     }
//   } else if (chartId === 3) {
//     for (let i = 0; i < data.length; i += 1) {
//       const conversation = data[i];
//       if ('enriched_text' in conversation) {
//         const entities = conversation.enriched_text.entities;
//         const dTone = voteLastUtteranceTone(conversation, 'CUSTOMER');
//         for (let e = 0; e < entities.length; e += 1) {
//           const entity = entities[e].text;
//           if (entityList.indexOf(entity) >= 0) {
//             entityMap[entity][dTone] += 1;
//           }
//         }
//       }
//     }
//   }

//   console.log(`Finished computing entity map for chart ${chartId}`);
//   entityMaps[chartId] = entityMap;
// }

// function computeEntityMap(entityMaps, queryString, res) {
//   const queryObj = { query: "#OVX", count: MAX_QUERY_NUM };

//   queryObj.environment_id = MY_ENVIRONMENT_ID;
//   queryObj.collection_id = MY_COLLECTION_ID;
//   console.log("computeEntityMap",queryObj)
//   discovery.query(queryObj, (error, queryData) => {
//     console.log("queryData",queryData)
//     if (queryData) {
//       const data = queryData.results;

//       const topics = [];

//       for (let i = 0; i < data.length; i += 1) {
//         const conversation = data[i];
//         if ('enriched_text' in conversation) {
//           const entities = conversation.enriched_text.entities;
//           for (let j = 0; j < entities.length; j += 1) {
//             const s = entities[j].text.toLowerCase();
//             if (s[0] === '#') {
//               entities[j].text = s.slice(1);
//             } else {
//               entities[j].text = s;
//             }
//             topics.push(entities[j].text);
//           }
//         }
//       }

//       const counts = {};

//       for (let i = 0; i < topics.length; i += 1) {
//         const key = topics[i];
//         let isSignificant = true;
//         for (let s = 0; s < preStopWords.length; s += 1) {
//           if (key.indexOf(preStopWords[s]) >= 0) {
//             isSignificant = false;
//             break;
//           }
//         }

//         if (isSignificant) {
//           counts[key] = (counts[key] || 0) + 1;
//         }
//       }

//       const fullEntityList = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

//       if (queryObj.query === undefined || queryObj.query === '') {
//         initialEntityList = fullEntityList;
//       }

//       const entityList = fullEntityList.slice(0, VISIBLE_NUM);

//         // construct entity map
//       for (let chartId = 1; chartId <= 3; chartId += 1) {
//         const fields = chartFields[chartId - 1];
//         const entityMap = {};
//         for (let k = 0; k < entityList.length; k += 1) {
//           const entity = entityList[k];
//           entityMap[entity] = {};
//           for (let f = 0; f < fields.length; f += 1) {
//             entityMap[entity][fields[f]] = 0;
//           }
//         }

//         mapEntities(chartId, data, entityList, entityMap, entityMaps);
//       }

//       if (res) {
//         entityMaps.fullEntityList = fullEntityList;
//         res.end(JSON.stringify(entityMaps));
//       }
//     }
//   });
// }

// function queryConversation(queryObj, res) {
//   queryObj.environment_id = MY_ENVIRONMENT_ID;
//   queryObj.collection_id = MY_COLLECTION_ID;

//   discovery.query(queryObj, (error, data) => {
//     if (data) {
//       const results = data.results;

//       if (!('id' in queryObj)) {
//         if (queryObj.query === undefined || queryObj.query === '') { initialConversations = results; }
//         if (res) { res.end(JSON.stringify(results)); }
//         return;
//       }

//       const chartId = +queryObj.id;

//       if (chartId === 1) {
//         const tone = queryObj.tone;
//         const filteredResults = [];
//         for (let i = 0; i < results.length; i += 1) {
//           const conversation = results[i];
//           const tones = conversation.Turn1.tones;
//           const dTone = getDominantTone(tones);
//           if (tone === dTone) {
//             filteredResults.push(conversation);
//           }
//         }
//         res.end(JSON.stringify(filteredResults.slice(0, queryObj.number)));
//       } else if (chartId === 2) {
//         const tone = queryObj.tone;
//         const filteredResults = [];
//         const fields = chartFields[chartId - 1];
//         for (let i = 0; i < results.length; i += 1) {
//           const conversation = results[i];
//           if (tone === voteConversationTone(conversation, fields, 'CUSTOMER')) {
//             filteredResults.push(conversation);
//           }
//         }
//         res.end(JSON.stringify(filteredResults.slice(0, queryObj.number)));
//       } else if (chartId === 3 || chartId === 4) { // check the last customer turn
//         const tone = queryObj.tone;
//         const filteredResults = [];
//         for (let i = 0; i < results.length; i += 1) {
//           const conversation = results[i];
//           const dTone = voteLastUtteranceTone(conversation, 'CUSTOMER');
//           if (tone === dTone) {
//             filteredResults.push(conversation);
//           }
//         }
//         res.end(JSON.stringify(filteredResults.slice(0, queryObj.number)));
//       }
//     }
//   });
// }

// function queryAgent(queryObj, res) {
//   queryObj.environment_id = MY_ENVIRONMENT_ID;
//   queryObj.collection_id = MY_COLLECTION_ID;
//   queryObj.aggregation = queryObj.aggregation || 'term(agent_name, count:5)';

//   discovery.query(queryObj, (error, data) => {
//     if (data) {
//       if (queryObj.query === undefined || queryObj.query === '') {
//         initialAgents = data.aggregations[0].results;
//       }
//       if (res) { res.end(JSON.stringify(data.aggregations[0].results)); }
//     }
//   });
// }

// function queryCustomer(queryObj, res) {
//   queryObj.environment_id = MY_ENVIRONMENT_ID;
//   queryObj.collection_id = MY_COLLECTION_ID;
//   queryObj.aggregation = 'term(customer_name, count:5)';

//   discovery.query(queryObj, (error, data) => {
//     if (data) {
//       if (queryObj.query === undefined || queryObj.query === '') {
//         initialCustomers = data.aggregations[0].results;
//       }
//       if (res) { res.end(JSON.stringify(data.aggregations[0].results)); }
//     }
//   });
// }

// function preComputeData() {
//   computeEntityMap(initialEntityMaps);  // note: keyword computation is done with entity computation
//   computeAgentMap(initialAgentMap);
//   queryConversation({ query: '', count: MAX_QUERY_NUM });
//   queryAgent({ query: '' });
//   queryCustomer({ query: '' });
// }

// // pre-computations when server starts
// preComputeData();

// // route requests
// app.post('/retrieveInitialDataMaps', (req, res) => {
//   const dataMaps = JSON.parse(JSON.stringify(initialEntityMaps));
//   console.log('req',dataMaps)
//   dataMaps['4'] = JSON.parse(JSON.stringify(initialAgentMap));
//   dataMaps.fullEntityList = initialEntityList;
//   res.end(JSON.stringify(dataMaps));
// });

// app.post('/updateEntityMaps', (req, res) => {
//   const entityMaps = {};
//   const searchString = req.body.query;
//   computeEntityMap(entityMaps, searchString, res);
// });

// app.post('/updateAgentMap', (req, res) => {
//   const agentMap = {};
//   const searchString = req.body.query;
//   computeAgentMap(agentMap, searchString, res);
// });

// app.post('/queryConversation', (req, res) => {
//   if (req.body.queryfromCache) {
//     res.end(JSON.stringify(initialConversations));
//   } else { queryConversation(req.body, res); }
// });

// app.post('/queryAgent', (req, res) => {
//   if (req.body.queryfromCache) {
//     res.end(JSON.stringify(initialAgents));
//   } else { queryAgent(req.body, res); }
// });

// app.post('/queryCustomer', (req, res) => {
//   if (req.body.queryfromCache) {
//     res.end(JSON.stringify(initialCustomers));
//   } else { queryCustomer(req.body, res); }
// });

// app.post('/uploadCSV', (req, res) => {
//   console.log('req',req.body.data)
//   let data = []
//   let rows = req.body.data.split('\n')
//   for(let index in rows){
//     if(index>0 && rows[index]){
//       let row = rows[index].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
//       let object = []
//       for(let i in row){
//         object[rows[0].split(',')[i]]=row[i]
//       }
//       data.push(object)
//     }
//   }
//   console.log('data',data)

//   let conversation = {};
//   conversation.text = '';
//   let id = 1;
//   var random = Math.random();
//   sync.fiber(() => {
//     for (let i = 0; i < data.length; i += 1) {
//       const utterance = data[i];
//       const utteranceID = utterance.utterance_id;
//       const text = utterance.text;
//       if (utterance.speaker_type == 'agent') {
//         console.log(conversation.agent_name);
//         conversation.agent_name = utterance.speaker_name;
//       } else {
//         conversation.customer_name = utterance.speaker_name;
//         console.log(utterance.speaker_name);
//       }
//       conversation.text += `${text}\n`;

//       const formattedUtterance = {};
//       formattedUtterance.speaker = utterance.speaker_type;

//       const params = {
//         utterances: [{
//           text: `${text}`
//         }]
//       };
//       const response = sync.await(toneAnalyzer.tone_chat(params, sync.defer()));
//       const tones = response.utterances_tone[0].tones;
//       const formattedTones = {};

//       if (tones.length > 0) {
//         for (let j = 0; j < tones.length; j += 1) {
//           const t = tones[j];
//           formattedTones[t.tone_name] = +t.score;
//         }
//       }

//       formattedUtterance.tones = formattedTones;
//       conversation[`Turn${utteranceID}`] = formattedUtterance;

//       if (i === data.length - 1) { // last row
//         console.log("##########");
//         conversation.length = utteranceID;
//         conversation.data_type = 'conversation';
//         conversation.conversation_id = utterance.conversation_id;
//         console.log('discoveryv1',JSON.stringify(conversation))
//         discoveryv1.addDocument({ environment_id: process.env.MY_ENVIRONMENT_ID, collection_id: process.env.MY_COLLECTION_ID, file: JSON.stringify(conversation), file_content_type:'application/json' },
//           function(error, data) {
//             console.log(JSON.stringify(data, null, 2));
//             res.status(200).send()
//           }
//         );
//       } else if (data[i + 1].utterance_id === '1') { // last utterance of one conversation
//         console.log("*********");
//         conversation.length = utteranceID;
//         conversation.data_type = 'conversation';
//         conversation.conversation_id = utterance.conversation_id;
//         discoveryv1.addDocument({ environment_id: process.env.MY_ENVIRONMENT_ID, collection_id: process.env.MY_COLLECTION_ID, file: JSON.stringify(conversation), file_content_type:'application/json' },
//           function(error, data) {
//             console.log(JSON.stringify(data, null, 2));
//             res.status(200).send()
//           }
//         );
//         conversation = {};
//         conversation.text = '';
//         id += 1;
//       }
//     }
//   });

// });


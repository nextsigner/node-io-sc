# node-io-sc
It is a Node Input/Output Socket Client.

This package was maked for node version 14.14.0

If you not have this node version, you can install nvm (Node Version Manager) and run:

$: nvm use 14.14.0

## How to use

export HOST=<your ip>
export PORT=<your port>

Example:

export HOST=192.168.1.35
export PORT=3111

npm start <userNameForThisClient> <debugOptional>

Example:

$: npm start user1 debug


## What else do you need

Do you need install the node-io-sc. It's a Node Input/Output Socket Client.

## What data type send and receive

This Node Input/Output Socket Server and Node Input/Output Socket Client send and receive a string data type with a JSON format.

For example: {"from":"user1", "to":"app2", "data":"closeRequest"}

## More functions
This node package run with a Node Input/Output Qml Client.

Get to this module in this repository: https://github.com/nextsigner/node-io-qml.

Example Qml code:

```javascript
NodeIOQml{
    id: nioqml
    user: 'user1'
    to: 'user2'
    host: '192.168.1.10'
    port: 3111
    onDataReceibed:{
        let d = new Date(Date.now())
        let sd=d.toString()
        let json=JSON.parse(data)
        log.text+='From: '+json.from+' '+sd+'\n'
        log.text+='To: '+json.to+'\n'
        log.text+='Data: '+json.data
        log.text+='\n\n'
    }
    onDataError:{
        log.text+='Error:\n'+e+'\n\n'
    }
}
```

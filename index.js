const {Socket} = require('net')

var USER = process.argv[2] || 'anonimo';
var TO = process.argv[3] || '';
var DATA = process.argv[4] || '';
var DEBUG = false;

var SERVERIP = process.env.NODEIOSIP || '127.0.0.1';
var PORT = process.env.NODEIOSPORT || 3111;
var FROMCMD=false;
var PERSISTENT=false
for(var i=0;i<process.argv.length;i++){
    let m0
    let arg=process.argv[i]
    if(arg.indexOf('debug')>=0)DEBUG=true
    if(arg.indexOf('port=')>=0){
        m0=arg.split('port=')
        PORT=parseInt(m0[1])
    }
    if(arg.indexOf('serverip=')>=0){
        m0=arg.split('serverip=')
        SERVERIP=m0[1]
    }
    if(arg.indexOf('persistent')>=0){
        PERSISTENT=true;
        console.log('{"from":"node-io-ss", "to":"'+USER+'", "data":"PERSISTENT: '+PERSISTENT+'"}')
    }

}

const client= new Socket()

var callBack = function (){
    if(DEBUG)console.log('Conectado a :'+SERVERIP+':'+PORT+' como '+USER)
    let json={};
    client.on('data', message => {
                  let m0=(`${message}`).split('"}{"from":"').join('"},{"from":"')
                  let snjson='{"messages":['+m0+']}'
                  //console.log('snjson:[---'+snjson+'---]')
                  if (message === 'disconnect') {
                      if(DEBUG)console.log('disconnecting from '+SERVERIP)
                      client.end()
                  } else {
                      //console.log(`Message from the Server: ${message}`)
                      //console.log(`${message}`)
                      try{
                          //json=JSON.parse(`${message}`);
                          json=JSON.parse(snjson);
                          //message=''
                      }catch(e){
                          let msgError='Error Message: ['+message+']'
                          msgError+='Error: '+e
                          //return console.log(`${message}`)
                          return console.log('')
                          //return console.log('Error: '+snjson)
                          //return console.log('Error:::'+msgError+'\n\nmessage:['+message+']')//console.error(e);
                      }
                      //console.log('snjson:[---'+JSON.stringify(json, null, 2)+'---]')
                      //console.log('\n------------->')
                      let ui=Object.keys(json.messages).length-1
                      //console.log('[---'+JSON.stringify(json.messages)+'---]')

                      if(json.messages[ui].to === USER || json.messages[ui].to === 'all'){
                          console.log(JSON.stringify(json.messages[ui]))
                      }
                  }
              })
    client.on('end', message => {
              if(FROMCMD)process.exit();
              })
    /*json.from=USER;
    json.to='node-io-ss';
    let d = new Date(Date.now())
    let msgConn='conn'
    msgConn+='_'+d.getTime();
    json.data=msgConn*/
    //client.write(JSON.stringify(json, null, 2))
}
client.connect(PORT, SERVERIP, callBack);

process.stdin.on('data', data => {
                     let dataWrited=`${data.toString()}`
                     dataWrited=dataWrited.substring(0,dataWrited.length-1);
                     //console.log('dataWrited:'+dataWrited)
                     let json={};
                     json.from=USER;
                     json.to='all';
                     json.data=dataWrited//`${data.toString()}`;
                     let m0=(json.data).split(' ');
                     if(m0.length>1 && m0[0].indexOf('to:')===0){
                         let m1=m0[0].split('to:');
                         json.to=m1[1];
                         let strDataForTo=''
                         for(var i=1;i<m0.length;i++){
                             strDataForTo+=m0[i]+' '
                         }
                         json.data=strDataForTo;
                     }
                     let ds=JSON.stringify(json, null, 2)
                     if(DEBUG)console.log('Enviando: '+ds)
                     if(!client.remoteFamily){
                         if(DEBUG)console.log('Reconectando...')
                         client.connect(PORT, SERVERIP, callBack);
                     }
                     client.write(ds);
                 });

if(DATA!=='' && TO!==''){
    if(!PERSISTENT)FROMCMD=true;
    let dataWrited=DATA
    dataWrited=dataWrited//.substring(0,dataWrited.length-1);
    //console.log('dataWrited from argv:'+dataWrited)
    let json={};
    json.from=USER;
    json.to=TO;
    json.data=dataWrited//`${data.toString()}`;
    let ds=JSON.stringify(json, null, 2)
    if(DEBUG)console.log('Enviando: '+ds)
    //    if(!client.remoteFamily){
    //        console.log('Reconectando...')
    //        client.connect(PORT, 'localhost', callBack);
    //    }
    client.write(ds);
    if(!PERSISTENT)client.end();
}

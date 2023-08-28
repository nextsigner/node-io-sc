const {Socket} = require('net')

const USER = process.argv[2] || 'anonimo';
const PORT = process.env.PORT || 3111;
const client= new Socket()

var callBack = function (){
    console.log('Conectado a localhost:'+PORT+' como '+USER)
    let json={};
    client.on('data', message => {
      if (message === 'disconnect') {
        console.log('disconnecting from localhost')
        client.end()
      } else {
        //console.log(`Message from the Server: ${message}`)
        //console.log(`${message}`)
        try{
          json=JSON.parse(`${message}`);
        }catch(e){
          return console.error(e);
        }
        console.log('\n------------->')
        if(json.to === USER){
          console.log('Datos para mi: '+json.to)
        }
        if(json.to === 'all'){
          console.log('Datos para todos: '+json.to)
        }
        console.log('De:'+json.from)
        console.log('Data:'+json.data)
        console.log('<-------------\n')
      }
    })
    json.from=USER;
    json.to='node-io-ss';
    let d = new Date(Date.now())
    let msgConn='conn'
    msgConn+='_'+d.getTime();
    json.data=msgConn
    client.write(JSON.stringify(json, null, 2))
}
client.connect(PORT, 'localhost', callBack);

process.stdin.on('data', data => {
    let dataWrited=`${data.toString()}`
    dataWrited=dataWrited.substring(0,dataWrited.length-1);
    let json={};
    json.from=USER;
    json.to='all';
    json.data=dataWrited//`${data.toString()}`;
    let m0=(json.data).split(' ');
    if(m0.length>1 && m0[0].indexOf('to:')===0){
        let m1=m0[0].split('to:');
        json.to=m1[1];
        json.data=m0[1];
    }
    let ds=JSON.stringify(json, null, 2)
    console.log('Enviando: '+ds)
    if(!client.remoteFamily){
        console.log('Reconectando...')
        client.connect(PORT, 'localhost', callBack);
    }
    client.write(ds);
});

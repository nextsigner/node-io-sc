const {Socket} = require('net')

const client= new Socket()

client.connect(3111, 'localhost', () => {
  console.log('connected to localhost')

  client.on('data', message => {
    if (message === 'disconnect') {
      console.log('disconnecting from localhost')
      client.end()
    } else {
      console.log(`Message from the Server: ${message}`)
    }
  })

  client.write('hello!')
})

process.stdin.on('data', data => {
  client.write(`${data.toString()}`);
  //process.exit();
});

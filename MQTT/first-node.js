var mqtt = require('mqtt')

module.exports = function(RED) {
  function DHT11Node(config) {
    var node = this;
    RED.nodes.createNode(node, config);
    var msg = {
        payload: "",
        topic: ""
    }
    var client  = mqtt.connect('mqtt://115.159.98.171:1883')
    var topic = config.location+"/"+config.type || "humi"
    client.on("connect", function(){
        node.log("尝试连接到服务器")
        client.subscribe(topic, function(err){
            if(err){
                node.log("sth went wrong!", err)
                console.log(err)
                client.end()
            }else{
                node.log("已连接到服务器.. 主题:" + topic)
            }
        })
    })

    client.on("message", function(topic, message){
        msg.payload = message.toString()
        msg.topic = config.topic
        node.send(msg);
    })

    node.on("close", function(){
        node.log("关闭节点链接")
        client.end()
    })
  }
  RED.nodes.registerType("温湿度",DHT11Node);
}
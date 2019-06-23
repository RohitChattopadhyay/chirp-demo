import React, { Component } from 'react';
import * as Font from 'expo-font'
import base64 from 'react-native-base64'
import { Container, Header, Content, Item, Input, Icon, H1, Button, Text, Picker } from 'native-base';
import { Audio } from 'expo-av'
const env = require('./env.json');

import { Ionicons } from '@expo/vector-icons';
export default class App extends Component {
  constructor(){
    super()
    this.state = {
      status: "idle",
      err: "No Error",
      loading: true,
      payload: "",
      msg: "",
      protocol: "standard"
    }
  }
  toHex = (str,hex) => {
    try{
      hex = unescape(encodeURIComponent(str))
      .split('').map(function(v){
        return v.charCodeAt(0).toString(16)
      }).join('')
    }
    catch(e){
      hex = str
      console.log('invalid text input: ' + str)
    }
    return hex
  }
  sendPayload = async () =>{
    this.setState({
      payload: this.state.msg
    },async ()=>{
        const payload = this.toHex(this.state.payload)
        if(payload.length<3){
          this.setState({
            err : "Message too short"
          })
          return
        }
        try{
          let url = `https://audio.chirp.io/v3/${this.state.protocol}/${payload}`
          this.setState({
            err : "",
            status : "send"
          })
          const playbackObject = await Audio.Sound.createAsync(
            { 
              uri:  url,
              headers: {
                Authorization: "Basic " + base64.encode(env.API_KEY)
              }
            },
            { shouldPlay: true },
          ).then((sound)=>{
            let status = sound.status
            if(sound.isMuted)
              this.setState({status: "error",err:"Increse Volume"})
            else setTimeout(() => {this.setState({status: "success"})}, status.playableDurationMillis)
          })
          return
        }
        catch(e){
            this.setState({
              err: e,
              status: "error"
            })
        }
      }
    )
  }
  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({
      loading: false
    })
  }
  iconSuggester = (e) => {
    switch (e) {
      case "idle":
        return null
        break
      case "send":
        return "time"
      case "success":
        return "checkmark-circle-outline"
      case "error":
        return "close-circle-outline"
      default:
        return null
        break
    }
  }
  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <Container>
        <Header />
        <Content>
          <Item regular>
            <Input placeholder='Enter Data to transfer' ref="payload" value={this.state.msg}  onChangeText={(msg) => this.setState({ msg })}/>
            <Icon name={this.iconSuggester(this.state.status)} />
          </Item>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            placeholder="Select frequency range"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            style={{ width: undefined }}
            onValueChange={(val) => this.setState({ protocol : val })}
            selectedValue={this.state.protocol}
          >
            <Picker.Item label="Standard ( Audible )" value="standard" />
            <Picker.Item label="Ultrasonic ( Inaudible )" value="ultrasonic" />
            <Picker.Item label="16kHZ" value="16kHZ" />
          </Picker>
          <Button full onPress={this.sendPayload}>
            <Text>Send</Text>
          </Button>
          <H1>{this.state.payload}</H1>
          <Text>{"\nError: " + this.state.err}</Text>
        </Content>
      </Container>
    );
  }
}
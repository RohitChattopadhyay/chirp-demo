import React, { Component } from 'react';
import * as Font from 'expo-font'
import base64 from 'react-native-base64'
import { Container, Header, Content, Item, Input, Icon, H1, Button, Text } from 'native-base';
import { Audio } from 'expo-av'


import { Ionicons } from '@expo/vector-icons';
export default class App extends Component {
  constructor(){
    super()
    this.state = {
      status: "idle",
      err: null,
      loading: true,
      payload: "",
      msg: "1234"
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
        try{
          let API = ""
          let url = API + '/standard/' + payload
          const playbackObject = await Audio.Sound.createAsync(
            { uri:  url},
            { shouldPlay: true }
          )
          return
        }
        catch(e){
            this.setState({
              err: e
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
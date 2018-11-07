/**
 * Custom WebView with autoHeight feature
 *
 * @prop source: Same as WebView
 * @prop autoHeight: true|false
 * @prop defaultHeight: 100
 * @prop width: device Width
 * @prop ...props
 *
 * @author Elton Jain
 * @version v1.0.2
 */

import React, { Component } from "react";
import { Dimensions, WebView } from "react-native";

const injectedScript = function() {
  function waitForBridge() {
    if (window.postMessage.length !== 1) {
      setTimeout(waitForBridge, 200);
    } else {
      let height = 0;
      if (document.documentElement.clientHeight > document.body.clientHeight) {
        height = document.documentElement.clientHeight;
      } else {
        height = document.body.clientHeight;
      }
      if (height == 0) {
        postMessage(document.documentElement.scrollHeight);
      } else {
        postMessage(height);
      }
    }
  }
  setTimeout(waitForBridge, 200);
  waitForBridge();
};

export default class MyWebView extends Component {
  state = {
    webViewHeight: Number
  };

  static defaultProps = {
    autoHeight: true
  };

  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight
    };

    this._onMessage = this._onMessage.bind(this);
  }

  _onMessage(e) {
    this.setState({
      webViewHeight: parseInt(e.nativeEvent.data)
    });
  }

  stopLoading() {
    this.webview.stopLoading();
  }

  render() {
    const _w = this.props.width || Dimensions.get("window").width;
    const _h = this.props.autoHeight
      ? this.state.webViewHeight
      : this.props.defaultHeight;
    return (
      <WebView
        ref={ref => {
          this.webview = ref;
        }}
        injectedJavaScript={
          "(" +
          String(injectedScript) +
          ")();" +
          "window.postMessage = String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');"
        }
        scrollEnabled={this.props.scrollEnabled || false}
        onMessage={this._onMessage}
        javaScriptEnabled={true}
        automaticallyAdjustContentInsets={true}
        {...this.props}
        style={[{ width: _w }, this.props.style, { height: _h }]}
      />
    );
  }
}

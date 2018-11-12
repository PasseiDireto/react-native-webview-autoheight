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
      setTimeout(waitForBridge, 1000);
    } else {
      let height = 0;
      if (document.documentElement.clientHeight > document.body.clientHeight) {
        height = document.documentElement.clientHeight;
      } else {
        height = document.body.clientHeight;
      }
      if (height == 0) {
        height = document.documentElement.scrollHeight;
      }
      window.postMessage(JSON.stringify({ height: height }));
    }
  }
  setTimeout(waitForBridge, 1000);
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
    const message = JSON.parse(e.nativeEvent.data);
    if (message.height) {
      this.setState({
        webViewHeight: parseInt(message.height)
      });
    }
    this.props.onMessageCallback(message);
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
        injectedJavaScript={"(" + String(injectedScript) + ")();"}
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

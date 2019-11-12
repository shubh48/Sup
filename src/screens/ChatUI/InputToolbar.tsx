import React, {Component} from 'react';
import {View, StyleSheet, Text, Keyboard, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojis from '../../utils/emoji';
import px from '../../utils/normalizePixel';
import Composer from './Composer';
import Send from './Send';
import EmojiPicker from './EmojiPicker';
import Touchable from '../../components/Touchable';
import {sendMessage} from '../../services/rtm';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ThemeInjectedProps & {
  chatId: string;
  threadId: string;
};

class InputToolbar extends Component<Props> {
  state = {
    text: '',
    emojiSelectorVisible: true,
  };

  handleTextChanged = text => this.setState({text});

  handleSendPress = () => {
    sendMessage({
      type: 'message',
      text: this.state.text,
      channel: this.props.chatId,
      thread_ts: this.props.threadId,
    });
    this.setState({text: ''});
  };

  handleEmojiButtonPress = () => {
    if (!this.state.emojiSelectorVisible) {
      Keyboard.dismiss();
    } else {
      // TODO: focus on input
    }
    this.setState({emojiSelectorVisible: !this.state.emojiSelectorVisible});
  };

  handleEmojiPickerClosed = () => this.setState({emojiSelectorVisible: false});

  handleEmojiPickerOpened = () => this.setState({emojiSelectorVisible: true});

  handleEmojiSelected = emoji => {
    this.setState({text: this.state.text + emoji.char});
  };

  renderComposer() {
    return (
      <Composer
        text={this.state.text}
        onTextChanged={this.handleTextChanged}
        isThread={!!this.props.threadId}
      />
    );
  }

  renderSend() {
    return <Send onPress={this.handleSendPress} />;
  }

  renderEmojiPicker() {
    if (!this.state.emojiSelectorVisible) return null;
    return (
      <EmojiPicker
        onEmojiSelected={this.handleEmojiSelected}
        onClose={this.handleEmojiPickerClosed}
        onOpen={this.handleEmojiPickerOpened}
      />
    );
  }

  renderEmojiButton() {
    let {theme} = this.props;
    return (
      <Touchable style={styles.emojiButton} onPress={this.handleEmojiButtonPress}>
        <MaterialCommunityIcons
          name="emoticon"
          size={px(21)}
          color={theme.foregroundColorMuted65}
          style={{marginTop: px(2.5), marginLeft: px(1)}}
        />
      </Touchable>
    );
  }

  render() {
    let {theme} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={[styles.emojiAndComposeWrapper, {backgroundColor: theme.backgroundColor}]}>
            {this.renderEmojiButton()}
            {this.renderComposer()}
          </View>

          {this.renderSend()}
        </View>
        {this.renderEmojiPicker()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: px(5),
    alignItems: 'flex-end',
    paddingBottom: px(7.5),
  },
  emojiButton: {
    borderRadius: px(15),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: px(10),
    paddingBottom: Platform.select({ios: px(7.5), web: px(7.5), default: px(11)}),
  },
  emojiAndComposeWrapper: {
    backgroundColor: '#333333',
    flexDirection: 'row',
    flex: 1,
    borderRadius: px(20),
    alignItems: 'flex-end',
  },
});

export default withTheme(InputToolbar);
